# Архитектура Code Dungeon

## Статус

Документ описывает фактическую архитектуру challenge/room flow после рефакторинга. Источником истины остаётся реальный код.

## Границы

### Domain

`src/game/domain`

Содержит чистые игровые правила:

- подсчёт правильных ответов;
- battle outcome;
- HR outcome и допустимое количество ошибок;
- создание battle и HR наград.

Domain не зависит от JSON, HTTP, Zustand, React и Phaser.

### Application

`src/game/application`

Содержит сценарии использования:

- запуск battle или HR challenge через `QuestionRepository`;
- завершение challenge по выбранным ответам;
- единственный расчёт outcome и награды;
- создание и переходы run;
- идемпотентное применение результата комнаты;
- применение и расходование эффектов.

### Infrastructure

`src/game/infrastructure/questions`

Содержит конкретный локальный источник вопросов:

- versioned JSON-каталоги;
- DTO;
- runtime validation;
- mapper DTO → domain;
- `LocalQuestionRepository`.

Будущий HTTP-адаптер должен реализовать тот же `QuestionRepository`. React, Phaser, stores и domain при этом не меняются.

### Features

`src/features/play-challenge`

- challenge Zustand adapter;
- защита от устаревшего асинхронного запроса;
- presentation mapper без `correctOptionId`;
- Challenge Overlay.

`src/features/pause-game`

- независимое состояние паузы и подтверждений.

### Phaser

`src/app/[locale]/game/scenes`

Phaser:

- определяет вход в комнату;
- запускает challenge request;
- ждёт готовый application result;
- визуализирует уже рассчитанную награду;
- запускает переход к следующей комнате.

Phaser не читает вопросы, не проверяет ответы и не создаёт награды.

### React

React Overlay получает presentation model без правильных ответов. Он отображает вопросы и возвращает только пары `questionId` / `optionId`.

React не рассчитывает outcome и не применяет результат комнаты.

## Поток challenge

```text
Phaser room entry
  → ChallengeRequest
  → challenge feature store
  → ChallengeSessionService
  → QuestionRepository
  → local JSON adapter / future HTTP adapter
  → ActiveChallenge
  → presentation mapper
  → React ChallengeOverlay
  → selected answers
  → ChallengeSessionService
  → ChallengeResult с outcome и наградой
  → run application
  → Phaser visualisation
```

## Инварианты

- Battle и HR контент хранится только в JSON.
- Обычная Battle Room не выдаёт HR-эффекты.
- HR Room не выдаёт обычные эффекты.
- Слабое/ровное/сильное впечатление разрешает 0/1/2 ошибки.
- HR Room предлагается не более одного раза за run.
- Результат одной комнаты применяется не более одного раза.
- Награда рассчитывается один раз application-сервисом.
- Бафы и дебафы хранятся в едином `activeEffects` в порядке получения и в том же порядке отображаются в HUD.
- Один эффект не может одновременно находиться в `activeEffects` дважды; после удаления он снова доступен в пуле наград.

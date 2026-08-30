---
title: Сценарии команд
sidebar_position: 2
---

# Сценарии команд

В этом руководстве описаны типовые сквозные сценарии CLI.

## 1) Первичная настройка новой машины

Установите последнюю LTS-версию Node.js:

```powershell
nvm install lts
```

Задайте её версией по умолчанию:

```powershell
nvm use lts
```

Проверьте версию по умолчанию:

```powershell
nvm default
node -v
```

Дополнительная проверка:

```powershell
nvm env
nvm doctor
```

## 2) Тестирование проекта на нескольких версиях

Установите несколько версий Node.js сразу:

```powershell
nvm install 18 20 22
```

Все версии загрузятся параллельно, затем установятся последовательно.

Переключайтесь между версиями для тестов:

```powershell
nvm use 18
npm test
nvm use 20
npm test
nvm use 22
npm test
```

Используйте alias для удобства:

```powershell
nvm alias add legacy 18.20.8
nvm alias add modern 24.1.0
```

## 3) Закрепление версии проекта через run command files

Задайте версию по умолчанию и создайте локальный `.nvmrc`:

```powershell
nvm use 24
nvm pin 24 --file=.nvmrc
```

Или обновите engines в package.json:

```powershell
nvm pin 24 --file=package.json
```

## 4) Среды с ограничением загрузок

Предварительно закэшируйте артефакты:

```powershell
nvm cache add 20 22 24
nvm cache list
```

Используйте управление кэшем при установке:

```powershell
nvm install 24 --cache
```

Очистка после развёртывания:

```powershell
nvm cache remove version 20.19.1
nvm cache remove all
```

## 5) Управление режимом выполнения

Переключение режима:

```powershell
nvm use shim
nvm use link
```

Временное отключение/включение nvm:

```powershell
nvm off
nvm on
```

## 6) Конфигурация и операции с учётом политик

Просмотр эффективных значений:

```powershell
nvm config list
nvm config get mode root auto_install
```

Применение изменений:

```powershell
nvm config set mode=shim auto_install=true
```

Сброс к значениям по умолчанию:

```powershell
nvm config reset auto_install
```

## 7) Проверка состояния и обновление

```powershell
nvm doctor --list
nvm doctor --autofix
nvm upgrade --check
nvm upgrade
```

## Связанные материалы

- [Команды](../command/install)
- [Спецификаторы версий](./version-resolution)
- [Селекторы версий](./version-resolution)
- [nvm config](../command/config)
- [Режимы работы](../features/modes)

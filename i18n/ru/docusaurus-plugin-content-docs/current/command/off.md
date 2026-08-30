---
title: off
sidebar_position: 12
sidebar_label: off
---

# nvm off

Временно прекратить управление Node.js через NVM.

## Использование

```powershell
Usage: nvm off
```

## Аргументы

Эта команда не принимает аргументов.

## Флаги

У этой команды нет флагов.

## Поведение

| Шаг | Деталь |
|-----|--------|
| Отключение link | Удаляет управляемую цель `.nodejs` |
| Настройки | Устанавливает [`enabled=false`](../cfg/core#related-settings) |
| Установки | Установленные версии Node.js остаются на диске |

## Пример

```powershell
nvm off
```

## Пример вывода

```powershell
NVM for Windows is no longer managing Node.js installations.
```

## Проверенная расшифровка (локальный запуск)

```powershell
PS> nvm off --help
Usage: nvm off

Stop managing Node.js with nvm.
```

## Типичные сценарии

- Краткосрочное устранение неполадок
- Временная передача управления для экспериментов с неуправляемой средой выполнения

Используйте `nvm on` для повторного включения управления.

---
title: set
sidebar_position: 3
sidebar_label: set
---

# nvm config set

Установить одно или несколько значений конфигурации.

## Использование

```powershell
nvm config set <key=value> [<key=value> ...]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `<key=value> ...` | Да | Одно или несколько присвоений. См. [форматы значений](/command/config#config-set-value-formats) на родительской странице. |

## Примеры

```powershell
nvm config set mode=shim
nvm config set auto_install=true auto_install_prompt=false
nvm config set auto_detect=.nvmrc,.node-version,package.json
nvm config set node_mirror=https://nodejs.org/dist
```

## Пример вывода

```powershell
mode : shim
```

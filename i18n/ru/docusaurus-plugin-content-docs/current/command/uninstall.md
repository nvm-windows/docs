---
title: uninstall
sidebar_position: 2
sidebar_label: uninstall
---

# nvm uninstall

Удаление одной или нескольких версий Node.js.

**Псевдонимы:** `rm`, `un`

## Использование

```powershell
Usage: nvm uninstall (rm,un) <version> ... [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `<version> ...` | Да | Один или несколько [спецификаторов версии](../guide/version-resolution). Разрешаются перед удалением. |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--purge` | | Удалить соответствующие кэшированные артефакты загрузки для каждой удалённой версии. |

Внутренние флаги автоматизации `--notify` и `--from-apps` существуют в исходном коде и скрыты из справки. `--from-apps` используется Windows Apps (ARP `QuietUninstallString`) для неинтерактивного удаления.

## Примеры

```powershell
# uninstall exact version
nvm uninstall 20

# uninstall multiple versions in one call
nvm uninstall 20 18

# uninstall and purge cache for the same version
nvm uninstall 20.19.1 --purge

# uninstall via alias
nvm alias add oldlts 18.20.8
nvm uninstall oldlts
```

## Пример вывода

```powershell
Removed Node.js v20.19.1
Purged cached artifact for v20.19.1
```

## Проверенная расшифровка (локальный запуск)

```powershell
PS> nvm uninstall --help
Usage: nvm uninstall (rm,un) <version> ... [flags]

Uninstall one or more Node.js versions.

Flags:
	--purge    Purge the cache of this version (if cached).
```

## Примечания

- Можно удалить несколько версий одной командой.
- Используйте `--purge`, когда нужна очистка и среды выполнения, и артефактов.
- При удалении активной версии по умолчанию установите другую через `nvm use`.

См. также [nvm list](./list/) и [nvm use](./use/).

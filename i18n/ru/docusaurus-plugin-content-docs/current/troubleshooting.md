---
sidebar_label: Устранение неполадок
sidebar_position: 7
---

# Устранение неполадок

| Симптом | Вероятная причина | Проверить | Исправление |
|:-|:-|:-|:-|
| `vX is not installed` при `nvm use X` | Запрошенная версия отсутствует, auto-install выключен | `nvm list installed` | `nvm install X`; опционально `nvm use X --install` |
| `No previously active version found.` при `nvm use last` | Предыдущая версия по умолчанию ещё не сохранена | `nvm default` | Задайте версию через `nvm use X`, затем снова `nvm use last` |
| `No versions installed.` | Новая машина или неверный корень установки | `nvm env`; `nvm config get root` | `nvm install lts`; исправьте root через `nvm config set root=...` |
| `Blocked by this computer's policy.` | Политика блокирует настройку или операцию | `nvm config list`; `nvm config get <key>` | Согласуйте с владельцем IT-политики; не обходите политику локально |
| `sync.exe not found` для `doctor` или `upgrade` | Утилита sync отсутствует или повреждена | `nvm env`; выполните `nvm doctor --list` | Переустановите/восстановите дистрибутив, чтобы вернуть sync |
| Режим link не активируется | Нет прав на link/junction или проблема с путём | `nvm use link`; `nvm env` | Переключитесь на shim (`nvm use shim`) или выдайте нужные права на link |
| Кэш слишком большой | Долгое хранение кэша | `nvm cache list`; `nvm list cached` | `nvm cache remove version ...`; `nvm cache remove all` |
| Предупреждения о недоступности зеркала | Сеть/прокси/зеркало | раздел доступности зеркала в `nvm env` | Задайте зеркала/прокси: `nvm config set node_mirror=... npm_mirror=... proxy=...` |
| Команда alias отклонена | Использовано зарезервированное имя alias | `nvm alias list` | Выберите не зарезервированный alias (`legacy`, `stable24` и т. д.) |
| `package.json not found` при `nvm pin --file=package.json` | Команда запущена не в том каталоге | `dir package.json` | Запустите в корне проекта или используйте цель `.nvmrc` |

## Рекомендуемый порядок диагностики

1. Снимите снимок окружения.

```powershell
nvm env
nvm default
nvm config list
```

2. Проверьте установленное состояние и runtime.

```powershell
nvm list installed
nvm list cached
where.exe node
```

3. Запустите диагностику.

```powershell
nvm doctor --list
nvm doctor
```

4. Примените точечное исправление (install, use, config, cache или режим).

5. Повторно проверьте через `nvm env` и `nvm doctor`.

## Заметки для корпоративных сред

- В certified/управляемых средах политика может намеренно блокировать локальные изменения отдельных настроек.
- Предпочитайте исправления, совместимые с политикой, а не ручные правки реестра.
- Для проблем на парке машин используйте `nvm env --json` и `nvm doctor --json` для машиночитаемой диагностики.

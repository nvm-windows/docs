---
title: Коды ошибок
sidebar_label: Коды ошибок
sidebar_position: 2
---

# Коды ошибок

NVM for Windows использует стабильные коды `NVM####` в сообщениях CLI, выводе shim/proxy и журналах Windows Application / operational. Эта страница даёт общий смысл кода; на конкретной машине смотрите полный текст в `nvm doctor` и Event Viewer.

| Код | Смысл | Обычно возникает когда |
|:-|:-|:-|
| **NVM4100** | Тихая установка отклонила нестандартный каталог программы | Community Inno Setup с `/SILENT` или `/VERYSILENT` и нестандартным `/DIR` (корень программы должен оставаться под LocalAppData) |
| **NVM4101** | Community-сборка запущена вне доверенного корня программы | Community `nvm.exe` (или doctor) видит процесс не под `%LOCALAPPDATA%\Author Software\nvm`; предупреждение, не жёсткая блокировка |
| **NVM4301** | Проверка целостности Node.js не прошла | Shim или node launcher отказывается запускать `node.exe` из‑за сбоя Authenticode / trust; обычно помогает `nvm install <ver> --force` |
| **NVM4302** | Блокировка активации в режиме link | `nvm use` (link) отклоняет небезопасный каталог версии (например, доступен другим пользователям на запись или reparse point) либо непроверенный `node.exe` |
| **NVM4303** | Изменилось состояние verify-cache | Материал trusted verify-cache для Node-бинарника больше не совпадает; нужна полная повторная проверка |
| **NVM4304** | Полная проверка восстановлена | Информационное продолжение после **NVM4303**: полная проверка прошла, кэш восстановлен |
| **NVM4305** | Запуск package manager заблокирован (небезопасный каталог Node) | Proxy блокирует `npm` / `yarn` / `pnpm` (и аналоги), потому что каталог активной версии не проходит проверки cross-user write / trust; часто помогает `nvm doctor --autofix` или частный install root |
| **NVM4306** | Сбой доверия к делегированной команде | Proxy отклоняет entrypoint package manager или скрипт: неизвестный, без подписи или не проходит delegated-command trust |

## Диапазоны

| Диапазон | Назначение |
|:-|:-|
| **NVM41xx** | Установщик / граница поддержки Community layout |
| **NVM43xx** | Runtime trust Node, активация и gatekeeping package manager |

## Подсказки

- Коды встречаются в тексте как `Event code: NVM####` и могут попадать в Application log или operational-каналы NVM (зависит от edition).
- **NVM4304** — успешное/восстановительное событие, не ошибка.
- Симптомы без кода: [Общее устранение неполадок](./general).

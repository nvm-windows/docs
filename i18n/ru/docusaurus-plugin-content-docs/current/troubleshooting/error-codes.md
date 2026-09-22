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
| **NVM4401** | Удалённый firewall authority: unauthorized | HTTPS policy URL вернул **401**; remote отказал в доступе этому пользователю/клиенту |
| **NVM4402** | Сбой удалённой проверки firewall | HTTPS policy URL: TLS failure, неожиданный HTTP-статус или ошибка helper/config |
| **NVM4403** | Module firewall заблокировал установку | Локальный или удалённый **403** policy deny (`ApprovedModules` / `ApprovedGlobalModules`) |
| **NVM4404** | Требуется elevation для firewall | Мутирующая команда firewall без прав администратора |
| **NVM4405** | Некорректное правило firewall | Неверный элемент TrustedModules / ApprovedModules |
| **NVM4406** | Изменён недоверенный модуль | Аудит (не ошибка): изменился entrypoint недоверенного global CLI; пишется при deny, allow и accept/decline prompt |
| **NVM4407** | Удалённая policy разрешила | Аудит (не ошибка): HTTPS module-firewall remote check разрешил install |
| **NVM4408** | Module firewall разрешил install | Аудит (не ошибка): proxy оценил module policy и разрешил install |
| **NVM4409** | Удалённый firewall authority недоступен | HTTPS policy host отклонил соединение, таймаут или DNS не резолвится |
| **NVM4410** | Изменена политика firewall | Аудит: `nvm firewall` изменил список политики |

## Диапазоны

| Диапазон | Назначение |
|:-|:-|
| **NVM41xx** | Установщик / граница поддержки Community layout |
| **NVM43xx** | Runtime trust Node, активация и gatekeeping package manager |
| **NVM44xx** | NVM Firewall (version / module / trust policy) |

## Подсказки

- Коды встречаются в тексте как `Event code: NVM####` и могут попадать в Application log или operational-каналы NVM (зависит от edition).
- **NVM4304** — успешное/восстановительное событие, не ошибка.
- **NVM4406** — audit/info о смене недоверенного модуля (в т.ч. при allow или accept prompt), не ошибка.
- **NVM4407** и **NVM4408** — audit/info о разрешённых module-firewall install (remote HTTPS vs локальная/remote оценка), не ошибки.
- Симптомы без кода: [Общее устранение неполадок](./general).

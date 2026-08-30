---
sidebar_position: 2
certified: true
---

# Корпоративное развёртывание

Развёртывание Certified-сборок выполняется в пять этапов. Для вашей платформы проходите этапы по порядку.

|Этап|Руководство|Что нужно сделать|
|:-|:-|:-|
|1. Подготовка|[Требования](../../install/enterprise/requirements)|[Скачайте](https://portal.author.io) дистрибутив и проверьте ОС/прокси/сеть.|
|2. Установка|[Установщики](../../install/installers)|Разверните NVM for Windows через Intune, GPO или вручную.|
|3. Настройка политик|[Настройка политик](policy/)|Примените политики NVM (ADMX, registry CSP, базовые профили соответствия).|
|4. Эксплуатация и сопровождение|[Эксплуатация и сопровождение](operations/)|Отслеживайте логи, обновления и соответствие требованиям.|
|5. Удаление|[Удаление](../../install/uninstall)|Удалите NVM for Windows с управляемых устройств.|

## Выберите платформу

|Платформа|Установка|Политики|
|:-|:-|:-|
|Microsoft Intune|[Установка → Intune](../../install/enterprise/intune)|[Административные шаблоны](../../cfg/ad#intune-policy-configuration)|
|Active Directory GPO|[Установка → GPO](../../install/enterprise/ad)|[Административные шаблоны](../../cfg/ad#group-policy-gpo-deployment)|
{/* |Microsoft Endpoint Configuration Manager (MECM)|[Install → MECM](../../install/enterprise/mecm)|[MECM](policy/mecm)| */}
{/* |Google Workspace|[Install → Google Workspace](install#google-workspace)|[Google Workspace](policy/google-workspace)| */}
|Вручную|[Установка → Вручную](../../install/installers)|[Справочник реестра](../../cfg/registry)|

Все ключи политик и типы значений реестра описаны в [центральном справочнике реестра](../../cfg/registry).

Скачайте пакеты развёртывания в [клиентском портале](https://portal.author.io).

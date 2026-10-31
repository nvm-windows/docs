---
title: Antivirus
sidebar_label: Antivirus
sidebar_position: 3
---

# Antivirus

Security software can lock the Windows key store while `npm upgrade -g` runs. The first `nvm reshim` then fails. The second `nvm reshim` often succeeds because the lock is gone.

## What you see

The command prints **NVM4312**. The message names key `AuthorSoftware.NVM.VerifyCache`. It also names the key provider and a status such as `0x80090016`.

When `pubkey.cer` is present, the key was not deleted. NVM for Windows keeps only the public key in its `.verify` folder. The private key stays in the user CNG store under `%APPDATA%\Microsoft\Crypto\Keys`.

`nvm env` lists the antivirus product under **My Computer**. The label is `Not Detected` when Windows Security Center has no antivirus data. NVM4312 uses the same label. The message says the product is installed. It does not say that product blocked the call.

`nvm doctor` reports a missing verify key in the Verify cache check. The note names installed antivirus software and says that software may lock the key store. The note includes event code NVM4312.

NVM for Windows opens the key four times before it reports NVM4312. Certified Builds also write event `verify_key.open_failed` (Event ID 122) to `NVM for Windows/Operational`.

## Resolve the failure

1. Run `nvm reshim` again.
2. If NVM4312 remains, allow these processes to use the Microsoft Software Key Storage Provider and key container `AuthorSoftware.NVM.VerifyCache`:
   - `C:\Program Files\Author Software\nvm\nvm.exe`
   - `C:\Program Files\Author Software\nvm\utils\reshim.exe`

   On a per-user install, use the same file names under `%LOCALAPPDATA%\Author Software\nvm`.

3. For Microsoft Defender, add those two paths as **process** exclusions. Put the exclusions in a Defender Group Policy or an Intune antivirus profile. Do not put them in the NVM ADMX policy. Do not exclude `%APPDATA%\Microsoft\Crypto\Keys`. Tamper Protection blocks `Add-MpPreference` on the PC, so use the policy.
4. Arctic Wolf, CrowdStrike, and SentinelOne ignore Defender exclusions. Set the process exception in that product's console.

A publisher allow for Author Software Inc. can allow the programs to start. It does not turn off a hook on `ncrypt.dll`.

# What's new in v2

NVM for Windows 2 adds support for shim mode. In shim mode, NVM for Windows provides lightweight shims for commands like `node`, `npm`, and `corepack`. These shims make it possible to support new workflows such as per-directory version switching.

Link mode is still available for users who prefer the legacy behavior. Link mode is especially useful in air-gapped environments, or anywhere a simpler static link model is preferred.

The Community Edition remains free and open-source. Commercial plans are available for organizations that need signed installers, compliance materials, governance controls, or custom support.

## Automation

### Per-directory version switching

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 can automatically select a Node.js version based on the current directory. This is enabled by shim mode, because commands like `node`, `npm`, and `corepack` pass through NVM for Windows before resolving to a specific runtime.

### Auto-install missing versions

Available in: Community, Certified Distribution, Compliance, Governance, Custom

When a project requires a Node.js version that is not already installed, NVM for Windows 2 can install it automatically.

### Auto-install default global modules

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 can install user-defined default global modules when a new Node.js version is installed.

## Speed

### Parallel simultaneous installations

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 can install multiple Node.js versions at the same time.

### Smaller download sources

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 supports smaller download sources using 7z archives.

### Native extraction

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 uses native extraction to improve installation speed and reduce external dependencies.

### Caching

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 can cache downloaded and extracted assets to avoid repeating the same work.

### Lightweight shims

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 uses lightweight shims built with Zig.

### Zero-latency link mode

Available in: Community, Certified Distribution, Compliance, Governance, Custom

Link mode remains available for users who want legacy behavior without shim-based command interception.

## Native integrations

### Windows Apps

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 integrates with Windows application behavior.

### Windows Event Viewer

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 can write events to Windows Event Viewer.

### Windows Registry

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 can use the Windows Registry for native Windows configuration.

### Desktop Notification Center

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 can surface relevant events through the Windows Desktop Notification Center.

## Customization

### User-defined aliases

Available in: Community, Certified Distribution, Compliance, Governance, Custom

Users can define aliases for Node.js versions or version groups.

### User-defined default global modules

Available in: Community, Certified Distribution, Compliance, Governance, Custom

Users can define global modules that should be installed automatically with new Node.js versions.

### Local air-gapped downloads

Available in: Community, Certified Distribution, Compliance, Governance, Custom

NVM for Windows 2 can use local download sources in air-gapped or restricted environments.

## Commercial features

### Code-signed MSI installers

Available in: Certified Distribution, Compliance, Governance, Custom

Commercial distributions can provide code-signed MSI installers for managed Windows environments.

### SBOM, provenance, and release materials

Available in: Compliance, Governance, Custom

Compliance plans include release materials such as SBOM and provenance documentation.

### Fully auditable native logging

Available in: Governance, Custom

Governance plans provide native logging for audit and operational review.

### Active Directory and Entra integration

Available in: Governance, Custom

Governance plans can integrate with Active Directory and Entra for centralized administration.

### Restrict Node.js versions

Available in: Governance, Custom

Governance plans can restrict which Node.js versions are allowed, such as blocking end-of-life releases.

### Control NVM for Windows settings

Available in: Governance, Custom

Governance plans can control NVM for Windows settings through centralized policy.

### Advanced proxy support

Available in: Governance, Custom

Governance plans include advanced proxy support, including IWA.

### Custom Node.js mirrors

Available in: Governance, Custom

Governance plans include support for custom Node.js mirrors.

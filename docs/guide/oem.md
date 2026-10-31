---
title: Preconfiguring a Windows Image
sidebar_label: OEM / Factory Images
---

import PageLink from '@site/docs/_components/PageLink';
import TrustArtifactList from '@site/docs/_components/TrustArtifactList';
import {recommendationLinks} from '@site/docs/_data/pages';

# Preconfiguring a Windows Image

:::tip[For Device Manufacturers]
This guide is for device manufacturers or anyone creating a Windows image preconfigured with NVM for Windows for mass deployment.
:::

:::important[Microsoft Zenith]
Microsoft Zenith already provides an image with NVM for Windows preconfigured.
:::

Since 2014, NVM for Windows has been the <a href={recommendationLinks.microsoft}>Microsoft</a>/<a href={recommendationLinks.google}>Google</a> recommended Node.js version manager. It serves over 20M developers, providing critical software infrastructure used daily by the Fortune 500, governments around the world, militaries, municipalities, education, finance, healthcare, and many other sectors. This legacy matters for OEM vendors who are shipping devices to users who may have extensive muscle memory built-in to their workflows.

In September 2026, NVM for Windows v2 was released with major changes.

- Two Operating Modes: [shim mode]() (modern) & [link mode]() (legacy)
- Two Release Builds: Community (MIT) & Certified (EULA)

Both of these have important concerns OEMs should address.

## Operating Modes

Shim mode was created in response to the shifting development demands of the development community and the organizations that support them. This operating mode adds modern workflow enhancements, safeguards, critical desktop security, and project awareness developers need to work safely and productively. This is the default / recommended mode.

Link mode was designed for legacy users who cannot easily transition from the older v1 workflows used in the last decade of Node.js development. This mode has been updated, but offers the same essential experience in v1. The primary difference from v1 is a completely integrated security strategy that no longer  requires extensive customization or elevated permissions to perform user-level operations. For legacy users, this is a significant improvement with far less "hassle". However; the nature of link mode provides a weaker security posture.

Users can toggle between modes any time. The question OEMs should be asking themselves is which experience their primary audience will be expecting. This needs to be balanced with industry expectations. We believe the legacy version management pattern promotes shadow-IT, which is a very common implementation pattern in version managers of any language/runtime. NVM for Windows v2 was designed to break this pattern and operate within the controls of Windows instead of around it. Shim mode encourages this and provides the first step towards safe, auditable, and governed Node.js development.

## Builds

Community and Certified Builds offer the same fundamental developer experience, but differ in purpose and technical architecture.

### Community Build Considerations

Community Builds are designed for user-controlled installations. The application is installed to the user's directory, giving their account full control of Node.js installations on Windows. This is the recommended build for general distribution on OEM images.

### Certified Build Considerations

Certified Builds are designed for machine-controlled installations, where organizational controls / policies can be applied.

This build is designed for Microsoft Intune & Active Directory deployment, but also ships as a signed MSI installer. The application is deployed with core / sensitive assets managed in protected program file directories while user-specific data is managed in the user's application directory. This split allows organizations to install NVM for Windows on a per-machine basis while isolating per-user operations.

:::tip[Commercial Offering]
Certified Builds are available under an annual sitewide subscription. This is the base element for securing and managing Node.js in enterprise.

If you wish to distribute Certified Builds on an OEM image, please contact support@author.io.
:::

#### Available Enhancements

Creating a Windows image with NVM for Windows does not require anything other than the build. However; the extensibility of NVM for Windows depends on the chosen build. Only Certified Builds support the following add-ons.

|Add-on|OEM Compatibility|
|:-|:-|
|<PageLink id="trustArtifacts" />|<TrustArtifactList format="inline" />. These aren't typically distributed on OEM images. Highly regulated/audited organizations who require trust artifacts next to the application on disk could include these under a custom agreement with Author Software Inc.|
|Advanced&nbsp;Logging|Provides SIEM-integrated logging. This does not require changes to OEM images.|
|Governance|Enforce / lockdown usage policies. This does not require changes to OEM images.|

:::tip[Licensing]
Certified Builds operating without a valid license are limited to Community features, but it will not stop working.

Certified Builds, Advanced Logging, and Governance all require a sitewide license. Licenses can be distributed on an OEM image, but they carry an expiration date. Embedding licenses in Windows images is discouraged.

For OEM device distribution with Certified Builds, we recommend only preconfiguring the Certified Build. Licenses should be applied to fleets via Microsoft Entra, Active Directory, SECM, or other supported MDM platforms.

To discuss OEM licensing arrangements, please contact support@author.io
:::

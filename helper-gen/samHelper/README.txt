Developer's README file for the SAM Helper Chrome Extension
This file lives at: https://github.com/GSA-OCSIT/sam-helper

This directory contains three groups of files.

I. usdsJsHelper files
Files with the usdsJsHelper name or prefix are intended to be domain and application agnostic.
They form a JavaScript library that is the basis of a reusable web app assistant,
described elsewhere.
TODO:
Designate a custodian.
Provide references to the usdsJsHelper documentation and describe code management practices
for usdsJsHelper.

usdsJsHelper.js

II. samHelper files
Files with the samHelper name or prefix are intended to be domain specific but application agnostic.
Together, they tie the usdsJsHelper to SAM (sam.gov, the 'System for Award Management')
These files are to be maintained by people with an understanding of the SAM application domain.

Within samHelper, there are three types of file.
A. Connector files provide a glue-layer between the usdsJs application-agnostic code and the application-specific behavior of sam.gov.
Code which identifies an application page or a field on a page and tags it with a unique name is an example of glue code.

samHelper.js

B. Content files contain actual help content and styling for the SAM specific help.
samHelper.html
samHelper.css

C. The configuration file controls the behavior of SAM Helper.  It describes the pages and fields in SAM.
This information is stored locally at present, but should be retrieved from a BusinessUSA service in the future.

samHelper.json

III. Chrome extension files
The rest of the files package the SAM Helper in a Chrome browser extension.
These files are application specific but remain domain-agnostic.



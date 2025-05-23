# vscode-elara

This extension integrates the [elara](https://github.com/shravanasati/elara) CLI tool - a Jupyter notebook to HTML converter into VSCode.

![demo](https://raw.githubusercontent.com/shravanasati/vscode-elara/main/assets/demo.gif)

## Requirements

You must install elara first before using this extension. The installation instructions can be found [here](https://github.com/shravanasati/elara/#installation).

## Extension Settings

This extension contributes the following settings:

* `elara.theme`: The theme to use for the HTML output. Use `elara list-themes` to see all available themes. Can also be a path to a custom VSCode JSON theme file.

* `elara.font`: The font to use for the HTML output. Prefix `gf:` to use Google Fonts.

* `elara.codeFont`: The code font to use for the HTML output. Prefix `gf:` to use Google Fonts.

## Limitations

- The extension doesn't automatically manage (installation/update) or ship with the CLI tool.
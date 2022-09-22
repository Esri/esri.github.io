# esri.github.io

> Landing page for Esri open source projects.

Both the project categories and search suggestions in <http://esri.github.io> are powered by GitHub [topics](https://github.com/blog/2309-introducing-topics).

[<kbd>web-development</kbd>](https://github.com/Esri?q=topic%3Aweb-development)
[<kbd>data-management</kbd>](https://github.com/Esri?q=topic%3Adata-management)
[<kbd>spatial-analysis</kbd>](https://github.com/Esri?q=topic%3Aspatial-analysis)
[<kbd>publishing-sharing</kbd>](https://github.com/Esri?q=topic%3Apublishing-sharing)
[<kbd>native-development</kbd>](https://github.com/Esri?q=topic%3Anative-development)

You can find a complete list of searchable topics in [`search-topics.yml`](data/search-topics.yml). When a [topic](https://github.com/blog/2309-introducing-topics) is added to an Esri repository, it will be reflected in search immediately.

## Development

This project is a simple web page driven with JavaScript, [Calcite](https://developers.arcgis.com/calcite-design-system/), and [Tailwind CSS](https://tailwindcss.com/).

1. Fork and clone the project
2. In the terminal, run `npx serve`.
3. Open the browser to the URL given.

## Architecture

Information for the case studies and featured projects can be found in [`projects.yml`](data/projects.yml)

```yaml
- title: R Analysis
    description: Develop and share R statistical analysis with ArcGIS.
    url: //r-arcgis.github.io/
    displayLang: R
    searchLang: r
    stars: 109
```

## Contributing

Anyone and everyone is welcome to contribute. Please see our [guidelines for contributing](CONTRIBUTING.md).

## Code of conduct

All contributors and participants in this repository are expected to abide by our [code of conduct](https://github.com/Esri/contributing/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2022 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   <http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](https://raw.github.com/Esri/esri.github.com/master/license.txt) file.

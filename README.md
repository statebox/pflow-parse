quick and dirty parser for .pflow files http://www.pneditor.org/

to run under node

./node_modules/babel-cli/bin/babel-node.js  --presets es2015 ./example.js

parsed output

```json
{
    "places": [
        {
            "label": "a",
            "x": -280,
            "y": -164
        }, { ... }
    ],
    "transitions": [
        {
            "label": "f",
            "post": [
                2
            ],
            "pre": [
                0
            ],
            "x": -176,
            "y": -162
        }, { ... }
    ]
}
```

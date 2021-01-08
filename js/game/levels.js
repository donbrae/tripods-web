var TRIPODS = (function (mod) {

    // Arrangement of elements on grid for each level
    mod.levels = [
        [ // Level 1
            [ // UI layer: blocks and landing spots
                [0, 0, 0, 0, 5, 0, 0, 0],
                [0, 0, 6, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 6, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 4],
                [0, 0, 0, 0, 0, 0, 0, 4],
                [0, 0, 4, 4, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ],
            [ // UI layer: triangle character
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 0, 0, 7, 0],
                [0, 0, 0, 0, 0, 2, 0, 3]
            ]
        ],
        [ // Level 2
            [
                [0, 0, 0, 0, 4, 0, 0, 0],
                [0, 4, 4, 0, 0, 0, 4, 0],
                [0, 0, 4, 0, 4, 0, 0, 0],
                [0, 0, 6, 0, 0, 0, 0, 4],
                [5, 0, 0, 0, 0, 0, 0, 4],
                [0, 0, 6, 4, 0, 4, 0, 0],
                [0, 4, 0, 0, 0, 4, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 0, 0, 7, 0],
                [0, 0, 0, 0, 0, 3, 0, 2],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ]
        ]
    ]

    return mod;

}(TRIPODS || {}));

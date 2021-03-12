TRIPODS.levels = [
    // [
    //     ["#eda8ce", "#222"], // Test
    //     [],
    //     [0, 0, 0, 6, 0, 0],
    //     [0, 0, 0, 0, 0, 5],
    //     [0, 0, 0, 6, 0, 0],
    //     [0, 0, 2, 0, 0, 0],
    //     [1, 0, 0, 0, 0, 0],
    //     [0, 0, 3, 0, 0, 0]
    // ],
    // 1, 2, and 3 (feet) are required in all cases. If the feet have two colours (i.e. one of the feet is a different colour to the others), landing spots should be 5, 6 and 6. If the feet all have a different colour, landing spots should be 5, 6 and 7
    [
        ["#eda8ce", "#222"], // Foot/landing spot colours [<foot1>, <foot2>, <foot3:optional>]
        5, // Star rating thresholds: <= value → ★★★, <= value * 2 → ★★☆, else ★☆☆
        [0, 0, 0, 6, 0, 0],
        [0, 4, 4, 4, 0, 5],
        [0, 0, 0, 6, 0, 0],
        [0, 1, 0, 2, 0, 0],
        [0, 0, 0, 4, 0, 0],
        [0, 0, 3, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        9,
        [5, 0, 6, 0, 0, 0],
        [0, 0, 4, 0, 0, 0],
        [0, 6, 0, 0, 0, 0],
        [0, 0, 0, 4, 1, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 3]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        7,
        [0, 0, 0, 2, 0, 0],
        [0, 4, 0, 0, 4, 1],
        [0, 0, 0, 3, 0, 0],
        [6, 0, 0, 0, 0, 0],
        [0, 4, 5, 0, 4, 0],
        [6, 0, 0, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222"],
        6,
        [0, 0, 0, 0, 1, 0],
        [0, 4, 2, 4, 4, 4],
        [0, 0, 0, 0, 3, 0],
        [6, 4, 0, 0, 0, 0],
        [0, 4, 5, 0, 4, 0],
        [6, 4, 0, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222"],
        8,
        [6, 0, 6, 0, 0, 0],
        [0, 4, 0, 0, 4, 0],
        [0, 5, 0, 0, 4, 0],
        [0, 4, 0, 0, 0, 2],
        [0, 4, 0, 1, 4, 0],
        [0, 0, 0, 0, 0, 3]
    ],
    [
        ["#eda8ce", "#222"],
        8,
        [4, 0, 0, 0, 0, 5],
        [0, 4, 0, 6, 0, 0],
        [0, 0, 0, 4, 0, 6],
        [0, 1, 0, 0, 4, 0],
        [0, 0, 0, 4, 0, 0],
        [2, 0, 3, 0, 4, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        3,
        [0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4],
        [2, 0, 3, 0, 0, 4],
        [4, 4, 7, 0, 0, 0],
        [5, 0, 0, 0, 0, 0],
        [0, 0, 6, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222"],
        7,
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 4, 4, 0],
        [0, 2, 0, 3, 0, 0],
        [0, 4, 5, 0, 0, 0],
        [0, 4, 0, 0, 0, 4],
        [0, 6, 0, 6, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        7,
        [0, 0, 0, 0, 0, 2],
        [0, 0, 4, 1, 0, 0],
        [0, 5, 0, 0, 0, 3],
        [4, 0, 4, 0, 4, 0],
        [7, 0, 6, 0, 0, 0],
        [0, 0, 4, 0, 0, 0]
    ],

    [
        ["#eda8ce", "#222"],
        5,
        [0, 0, 1, 0, 0, 4],
        [0, 0, 4, 0, 0, 4],
        [4, 2, 4, 3, 0, 0],
        [4, 0, 5, 0, 4, 0],
        [0, 0, 4, 0, 4, 0],
        [0, 6, 4, 6, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        8,
        [0, 0, 4, 4, 1, 0],
        [0, 5, 0, 0, 0, 0],
        [0, 4, 0, 2, 4, 3],
        [6, 0, 6, 0, 0, 0],
        [0, 4, 0, 0, 4, 0],
        [0, 0, 0, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        10,
        [5, 0, 0, 4, 4, 0],
        [0, 4, 6, 0, 0, 0],
        [7, 4, 0, 0, 0, 0],
        [0, 0, 0, 4, 1, 0],
        [0, 4, 3, 4, 0, 4],
        [0, 0, 0, 0, 2, 4]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        7,
        [0, 4, 0, 0, 0, 0],
        [3, 4, 2, 0, 4, 4],
        [0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 6],
        [4, 4, 0, 5, 4, 0],
        [0, 0, 0, 0, 4, 6]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        5,
        [5, 0, 6, 4, 0, 4],
        [0, 4, 4, 0, 4, 4],
        [4, 7, 0, 0, 0, 4],
        [0, 4, 0, 4, 2, 0],
        [4, 0, 1, 0, 0, 0],
        [0, 0, 4, 0, 3, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        11,
        [0, 4, 4, 0, 4, 4],
        [4, 0, 0, 0, 0, 0],
        [4, 1, 0, 4, 0, 4],
        [0, 0, 0, 6, 0, 4],
        [2, 7, 3, 4, 4, 0],
        [4, 4, 0, 5, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        8,
        [0, 4, 5, 4, 6, 0],
        [0, 4, 0, 4, 0, 0],
        [0, 0, 4, 7, 0, 0],
        [0, 0, 4, 0, 4, 3],
        [0, 0, 0, 1, 4, 0],
        [0, 0, 0, 0, 0, 2]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        13,
        [0, 0, 4, 4, 2, 0],
        [4, 0, 1, 0, 0, 4],
        [0, 0, 0, 0, 3, 0],
        [0, 4, 0, 6, 4, 5],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 4, 4, 6, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        8,
        [0, 0, 2, 0, 4, 4, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [0, 4, 3, 0, 4, 0, 0],
        [0, 0, 4, 0, 0, 0, 4],
        [0, 0, 0, 5, 4, 0, 0],
        [0, 4, 0, 0, 0, 6, 0],
        [0, 0, 0, 7, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        8,
        [0, 0, 0, 0, 0, 0, 5],
        [0, 0, 4, 4, 7, 4, 4],
        [4, 4, 0, 1, 0, 0, 6],
        [0, 0, 0, 4, 4, 0, 0],
        [4, 4, 2, 0, 3, 0, 0],
        [0, 0, 4, 4, 0, 4, 4],
        [0, 0, 0, 0, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        15,
        [4, 0, 4, 0, 0, 2, 0, 0],
        [0, 4, 0, 4, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 3, 0, 0],
        [0, 0, 4, 4, 4, 0, 0, 4],
        [0, 0, 0, 0, 0, 0, 8, 0],
        [0, 0, 4, 5, 0, 4, 0, 4],
        [0, 4, 0, 0, 4, 0, 4, 0],
        [0, 0, 6, 0, 7, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        14,
        [0, 0, 0, 0, 4, 0, 1, 0],
        [0, 4, 4, 0, 0, 0, 0, 0],
        [0, 0, 4, 0, 4, 2, 0, 3],
        [0, 0, 6, 0, 0, 0, 0, 4],
        [5, 0, 0, 0, 0, 0, 0, 4],
        [0, 0, 6, 4, 0, 4, 0, 0],
        [0, 4, 0, 0, 0, 4, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        14,
        [5, 0, 0, 0, 0, 4, 0, 0],
        [0, 0, 6, 0, 4, 0, 0, 4],
        [7, 0, 0, 4, 0, 0, 0, 0],
        [0, 0, 4, 0, 0, 4, 0, 0],
        [0, 4, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 4, 0, 8, 0, 2],
        [0, 0, 0, 0, 0, 1, 4, 0],
        [0, 4, 0, 0, 0, 0, 0, 3]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        14, // > check
        [0, 1, 0, 0, 4, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0],
        [2, 0, 3, 0, 4, 0, 4, 0],
        [0, 0, 0, 4, 0, 0, 4, 0],
        [4, 4, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 5, 0, 4, 0, 0],
        [4, 0, 0, 0, 0, 4, 0, 4],
        [4, 0, 6, 0, 7, 0, 0, 4]
    ],
    [
        ["#eda8ce", "#222", "#7ee4ac"],
        15, // > check
        [0, 1, 0, 0, 0, 0, 0, 0],
        [4, 0, 4, 0, 0, 4, 0, 4],
        [3, 0, 2, 0, 0, 0, 0, 0],
        [0, 4, 4, 0, 0, 4, 4, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 4, 4, 0, 0, 0, 5, 0],
        [4, 0, 0, 4, 4, 0, 4, 0],
        [4, 0, 0, 0, 0, 6, 4, 7]
    ]
];

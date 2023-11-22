'use strict';
const patterns = [
    {
        title: 'simplest',
        duration: 2,
        tracks: [
            {
                freq: 2000,
                vol: 0.88,
                notes: [
                    0, 1
                ]
            }
        ]
    },
    {
        title: '7/8',
        duration: 3.5,
        tracks: [
            {
                freq: 4000,
                vol: 0.86,
                notes: [
                    0
                ]
            },
            {
                freq: 2000,
                vol: 0.66,
                notes: [
                    1, 2, 3
                ]
            },
            {
                freq: 1000,
                vol: 0.11,
                notes: [
                    0.5, 1.5, 2.5
                ]
            }
        ]
    },
    {
        title: '2-3',
        duration: 4,
        tracks: [
            {
                freq: 4000,
                vol: 0.86,
                notes: [
                    0
                ]
            },
            {
                freq: 2000,
                vol: 0.33,
                notes: [
                    1, 2, 3
                ]
            },
            {
                freq: 1500,
                vol: 0.66,
                notes: [
                    0.5, 1, 2, 2.75, 3.5
                ]
            }
        ]
    },
    {
        title: '4/4',
        duration: 4,
        tracks: [
            {
                freq: 4000,
                vol: 0.66,
                notes: [
                    0
                ]
            },
            {
                freq: 2000,
                vol: 0.66,
                notes: [
                    1, 2, 3
                ]
            },
            {
                freq: 1000,
                vol: 0.33,
                notes: [
                    0.5, 1.5, 2.5, 3.5
                ]
            }
        ]
    },
];
export {patterns};
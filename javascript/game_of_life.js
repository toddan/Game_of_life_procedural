/************************************************************
 *              GAME OF LIFE PROCEDURAL VERSION             *
 *                  (JavaScript / Node.js port)             *
 *                        Tord Munk                         *
 *                                                          *
 *  ABOUT:                                                  *
 *      This is a simple game of life implementation        *
 *      written in a procedural way. this is not            *
 *      meant to be a perfect implementation but            *
 *      more of a beginner first starters version.          *
 *      I tried to write it in a way that dose not aim      *
 *      to be "clever" but to be easy to                    *
 *      read and understand                                 *
 *      for a beginner programmer.                          *
 *                                                          *
 *      This is a port of the C# version (Program.cs).      *
 *      It uses plain JavaScript and only the modules       *
 *      that come with Node.js, no packages needed.         *
 *                                                          *
 *      Run it with:  node game_of_life.js                  *
 *                                                          *
 * LICENSE:                                                 *
 *      Do what you want with it                            *
 *                                                          *
 ************************************************************/

/*
 * readline is built into Node.js. We use it to read key presses
 * from the terminal, just like Console.ReadKey() in C#.
 * */
var readline = require("readline");

/*
 * Width and height of the cell matrix
 * */
var WIDTH = 50;
var HEIGHT = 25;

/*
 * x and y postitions of the cursor
 * */
var xpos = 0;
var ypos = 0;

/*
 * Cell char
 * */
var cellChar = "O";

/*
 * How many milliseconds to wait between each generation.
 * (The C# version runs as fast as it can)
 * */
var speed = 100;

/*
 * Cell matrix, each cell is a boolean that is either alive or dead.
 * True or False
 *
 * tiny example:
 *  000
 *  010
 *  000
 *
 * 0 = false
 * 1 = true
 * */
var Cells = create_cell_matrix();

/*
 * Set to true when the simulation is running so we stop
 * listening to the arrow keys.
 * */
var running = false;

main();

function main()
{
    console.log("Move the cursor with the arrow keys and press the spacebar to plant a cell.");
    console.log("then press s to start the simulation.");
    console.log("press q to quit.");
    console.log("press any key to begin");

    /*
     * Tell node to send us an event every time a key is pressed.
     * Raw mode means we get the key directly without having to press enter.
     * */
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    /* wait for the first key press, then start the game */
    process.stdin.once("keypress", function ()
    {
        clear_console();
        game_loop();
    });
}

/*
 * JavaScript does not have two dimensional arrays like bool[50, 25] in C#.
 * Instead we make an array of arrays, Cells[x][y], and fill it with false.
 * */
function create_cell_matrix()
{
    var matrix = [];

    for (var x = 0; x < WIDTH; x++)
    {
        matrix[x] = [];
        for (var y = 0; y < HEIGHT; y++)
        {
            matrix[x][y] = false;
        }
    }

    return matrix;
}

/*
 * Read the postition of the cursor in the console.
 * and starts the game when S is pressed.
 * */
function read_cursor_position(key)
{
    if (key.name == "up")
    {
       /*
        * Before we change the position of our cursor we must remove the previous
        * char in the console. If not we will leave "lines" behind the cursor
        **/
        remove_char();
        //We check that the cursor does not move outside of the cell matrix.
        //if ypos is 0, nothing happens, and if it is not, cursor can move up.
        if (ypos > 0)
        {
            ypos--;
        }
    }

    if (key.name == "down")
    {
        remove_char();
        if (ypos < HEIGHT - 1)
        {
            ypos++;
        }
    }

    if (key.name == "left")
    {
        remove_char();
        if (xpos > 0)
        {
            xpos--;
        }
    }

    if (key.name == "right")
    {
        remove_char();
        if (xpos < WIDTH - 1)
        {
            xpos++;
        }
    }

    if (key.name == "space")
    {
        remove_char();
        plant_cell();
    }

    if (key.name == "s")
    {
        running = true;
        hide_cursor();
        remove_char();
        clear_edges();
        /*
         * In C# we used while (true) to loop the algorithm forever.
         * In JavaScript a while (true) loop would freeze the program so it
         * can not read any more keys. Instead we ask JavaScript to call
         * start_algorithm again and again with a small pause in between.
         * */
        setInterval(start_algorithm, speed);
    }
}

/*
 * Calculates a cells neighbour and return the results.
 * We look around each cell in the boolean cell matrix and count
 * the number of neighbours
 * */
function neighbours(x, y)
{
    var neighbours = 0;

    if (Cells[x - 1][y - 1])
    {
        neighbours++;
    }
    if (Cells[x][y - 1])
    {
        neighbours++;
    }
    if (Cells[x + 1][y - 1])
    {
        neighbours++;
    }
    if (Cells[x - 1][y])
    {
        neighbours++;
    }
    if (Cells[x + 1][y])
    {
        neighbours++;
    }
    if (Cells[x - 1][y + 1])
    {
        neighbours++;
    }
    if (Cells[x][y + 1])
    {
        neighbours++;
    }
    if (Cells[x + 1][y + 1])
    {
        neighbours++;
    }

    return neighbours;
}

/*
 * Game of life algorithm.
 * Depending on the number of alive neigbours the outcome of the cell is determined.
 *
 * Rules for Game Of Life:
 *
 * If a living cell has fewer than two living neighbours it will die. If the living
 * cell has two or three live neighbours it lives on to the next generation. If a living
 * cell has more than three living neighbours it dies. If a dead cell has exactly
 * three living neighbours it becomes alive.
 *
 * Just like the C# version we skip the outer edge of the matrix,
 * that way neighbours() never looks outside of the matrix.
 * */
function start_algorithm()
{
    /* Allocate a new boolean cell matrix for each new generation */
    var new_generation = create_cell_matrix();

    for (var x = 1; x < WIDTH - 1; x++)
    {
        for (var y = 1; y < HEIGHT - 1; y++)
        {
            if (Cells[x][y])
            {
                /* If a cell is alive we check if it has two or three living neighbours */
                if (neighbours(x, y) >= 2 && neighbours(x, y) <= 3)
                {
                    new_generation[x][y] = true;
                }
                else/* if not it will die */
                {
                    new_generation[x][y] = false;
                }
            }
            else
            {
                /* If a dead cell has three neighbours it will become alive */
                if (neighbours(x, y) == 3)
                {
                    new_generation[x][y] = true;
                }
                else /* else it will stay dead */
                {
                    new_generation[x][y] = false;
                }
            }

            /* draw the next generation of cells on the console */
            draw_cells(x, y, new_generation);
        }
    }
    /* insert the new generation of cells */
    Cells = new_generation;
}

/*
 * Draws the cells on the console during the algorithm.
 * We also make sure we do not draw over any living cell.
 * */
function draw_cells(x, y, cells)
{
    if (cells[x][y] == true)
    {
        write_at(x, y, cellChar);
    }
    else
    {
        write_at(x, y, " ");
    }
}

/*
 * Removes all cells on the outer edge of the cell matrix.
 *
 * The algorithm never looks at the edge (see start_algorithm), so a cell
 * planted there would never change and just stay on the screen forever.
 * We kill those cells before the simulation starts so the board shows
 * the same thing as the cell matrix.
 * */
function clear_edges()
{
    for (var x = 0; x < WIDTH; x++)
    {
        for (var y = 0; y < HEIGHT; y++)
        {
            if (x == 0 || x == WIDTH - 1 || y == 0 || y == HEIGHT - 1)
            {
                Cells[x][y] = false;
                draw_cells(x, y, Cells);
            }
        }
    }
}

/*
 * Draws the cursor on the current postion
 * */
function draw_cursor()
{
    write_at(xpos, ypos, "#");
}

/*
 * Plants a cell on the current postition of the cursor
 * */
function plant_cell()
{
    /* make the cell alive */
    Cells[xpos][ypos] = true;
    write_at(xpos, ypos, cellChar);
}

/*
 * Removes the previous char of the cursor
 * So we do not draw "lines" when we plant cells
 * */
function remove_char()
{
    if (Cells[xpos][ypos])
    {
        write_at(xpos, ypos, cellChar);
    }
    else
    {
        write_at(xpos, ypos, " ");
    }
}

/*
 * Writes text at a position in the console.
 *
 * Node.js does not have Console.SetCursorPosition() like C#.
 * Instead we send a special "escape code" to the terminal:
 *   "\x1b[" + row + ";" + column + "H"
 * that moves the cursor. The terminal starts counting at 1, not 0,
 * so we add 1 to x and y.
 * */
function write_at(x, y, text)
{
    process.stdout.write("\x1b[" + (y + 1) + ";" + (x + 1) + "H" + text);
}

/*
 * Clears the console, like Console.Clear() in C#
 * */
function clear_console()
{
    process.stdout.write("\x1b[2J");
}

/*
 * Hides and shows the blinking terminal cursor,
 * like Console.CursorVisible in C#
 * */
function hide_cursor()
{
    process.stdout.write("\x1b[?25l");
}

function show_cursor()
{
    process.stdout.write("\x1b[?25h");
}

/*
 * Quits the game and puts the terminal back to normal
 * */
function quit()
{
    show_cursor();
    write_at(0, HEIGHT, "\n");
    process.exit();
}

/*
 * Game loop
 *
 * the loop that keeps the whole game running.
 * Not to be confused with the algorithm loop.
 *
 * In C# we used while (true) and Console.ReadKey() to wait for keys.
 * In JavaScript we instead tell node which function to run
 * every time a key is pressed, and node does the looping for us.
 * */
function game_loop()
{
    draw_cursor();

    process.stdin.on("keypress", function (str, key)
    {
        /* some keys do not have a name, we just ignore them */
        if (key == undefined)
        {
            return;
        }

        /* raw mode turns off ctrl+c, so we handle quitting ourselves */
        if (key.name == "q" || (key.ctrl && key.name == "c"))
        {
            quit();
        }

        if (running == false)
        {
            read_cursor_position(key);
            if (running == false)
            {
                draw_cursor();
            }
        }
    });
}

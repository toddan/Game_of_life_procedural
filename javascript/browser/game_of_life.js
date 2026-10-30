/************************************************************
 *              GAME OF LIFE PROCEDURAL VERSION             *
 *                 (JavaScript / browser port)              *
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
 *      Instead of the console it draws on a <canvas>       *
 *      in the web browser.                                 *
 *                                                          *
 *      Run it by opening index.html in a web browser.      *
 *                                                          *
 * LICENSE:                                                 *
 *      Do what you want with it                            *
 *                                                          *
 ************************************************************/

/*
 * Width and height of the cell matrix
 * */
var WIDTH = 50;
var HEIGHT = 25;

/*
 * How many pixels wide and high each cell is on the canvas
 * */
var CELL_SIZE = 16;

/*
 * Colors used when drawing
 * */
var cellColor = "#7CFC00";
var deadColor = "#000000";
var cursorColor = "#FF4500";

/*
 * x and y postitions of the cursor
 * */
var xpos = 0;
var ypos = 0;

/*
 * How many milliseconds to wait between each generation.
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

/*
 * The canvas is the "drawing area" on the web page.
 * The context is the object we use to actually draw on it.
 * */
var canvas = document.getElementById("board");
var context = canvas.getContext("2d");

main();

function main()
{
    /* start with an empty black board */
    clear_board();
    draw_cursor();
    game_loop();
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
 * Read the postition of the cursor.
 * and starts the game when S is pressed.
 * */
function read_cursor_position(key)
{
    if (key == "ArrowUp")
    {
       /*
        * Before we change the position of our cursor we must remove the previous
        * cursor from the board. If not we will leave "lines" behind the cursor
        **/
        remove_char();
        //We check that the cursor does not move outside of the cell matrix.
        //if ypos is 0, nothing happens, and if it is not, cursor can move up.
        if (ypos > 0)
        {
            ypos--;
        }
    }

    if (key == "ArrowDown")
    {
        remove_char();
        if (ypos < HEIGHT - 1)
        {
            ypos++;
        }
    }

    if (key == "ArrowLeft")
    {
        remove_char();
        if (xpos > 0)
        {
            xpos--;
        }
    }

    if (key == "ArrowRight")
    {
        remove_char();
        if (xpos < WIDTH - 1)
        {
            xpos++;
        }
    }

    if (key == " ")
    {
        remove_char();
        plant_cell();
    }

    if (key == "s" || key == "S")
    {
        running = true;
        /* remove the cursor so it is not left on the board */
        remove_char();
        /*
         * In C# we used while (true) to loop the algorithm forever.
         * In the browser a while (true) loop would freeze the whole web page.
         * Instead we ask the browser to call start_algorithm again and again
         * with a small pause in between.
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

            /* draw the next generation of cells on the canvas */
            draw_cells(x, y, new_generation);
        }
    }
    /* insert the new generation of cells */
    Cells = new_generation;
}

/*
 * Draws the cells on the canvas during the algorithm.
 * */
function draw_cells(x, y, cells)
{
    if (cells[x][y] == true)
    {
        fill_square(x, y, cellColor);
    }
    else
    {
        fill_square(x, y, deadColor);
    }
}

/*
 * Draws the cursor on the current postion.
 * The cursor is drawn as a square outline so you can
 * still see if there is a cell under it.
 *
 * The outline is drawn a little bit inside the cell. If it is drawn on the
 * edge of the cell, remove_char() will not paint over all of it and we
 * get "lines" behind the cursor.
 * */
function draw_cursor()
{
    context.strokeStyle = cursorColor;
    context.lineWidth = 2;
    context.strokeRect(xpos * CELL_SIZE + 2, ypos * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
}

/*
 * Plants a cell on the current postition of the cursor
 * */
function plant_cell()
{
    /* make the cell alive */
    Cells[xpos][ypos] = true;
    fill_square(xpos, ypos, cellColor);
}

/*
 * Removes the cursor from the board
 * So we do not draw "lines" when we move the cursor.
 * (It has the same name as in the C# version where the cursor was a char)
 * */
function remove_char()
{
    if (Cells[xpos][ypos])
    {
        fill_square(xpos, ypos, cellColor);
    }
    else
    {
        fill_square(xpos, ypos, deadColor);
    }
}

/*
 * Fills one cell on the canvas with a color.
 *
 * The canvas counts in pixels, not in cells, so we multiply
 * the cell position with the size of a cell.
 * We leave 1 pixel empty around each cell so you can see the grid.
 * */
function fill_square(x, y, color)
{
    context.fillStyle = color;
    context.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
}

/*
 * Paints the whole canvas black and draws every cell as dead,
 * like Console.Clear() in C#
 * */
function clear_board()
{
    context.fillStyle = "#333333";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var x = 0; x < WIDTH; x++)
    {
        for (var y = 0; y < HEIGHT; y++)
        {
            fill_square(x, y, deadColor);
        }
    }
}

/*
 * Game loop
 *
 * the loop that keeps the whole game running.
 * Not to be confused with the algorithm loop.
 *
 * In C# we used while (true) and Console.ReadKey() to wait for keys.
 * In the browser we instead tell the web page which function to run
 * every time a key is pressed (or the mouse is clicked),
 * and the browser does the looping for us.
 * */
function game_loop()
{
    document.addEventListener("keydown", function (event)
    {
        if (running == true)
        {
            return;
        }

        /* stop the arrow keys and space from scrolling the web page */
        if (event.key == " " || event.key.indexOf("Arrow") == 0)
        {
            event.preventDefault();
        }

        read_cursor_position(event.key);
        if (running == false)
        {
            draw_cursor();
        }
    });

    canvas.addEventListener("click", function (event)
    {
        if (running == true)
        {
            return;
        }

        /*
         * Find out which cell was clicked.
         * The canvas can be shown smaller than 800 pixels on a small screen,
         * so we first work out how big it really is on the page.
         * */
        var rect = canvas.getBoundingClientRect();
        var pixelX = (event.clientX - rect.left) * canvas.width / rect.width;
        var pixelY = (event.clientY - rect.top) * canvas.height / rect.height;

        var x = Math.floor(pixelX / CELL_SIZE);
        var y = Math.floor(pixelY / CELL_SIZE);

        /* a click on the very edge of the canvas can end up outside of the cell matrix */
        if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT)
        {
            return;
        }

        remove_char();
        xpos = x;
        ypos = y;
        plant_cell();
        draw_cursor();
    });
}

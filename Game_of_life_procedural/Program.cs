using System;
using System.Text;

namespace ConsoleApplication1
{
    /************************************************************
     *              GAME OF LIFE PROCEDURAL VERSION             *
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
     *      The code dose not follow any standard C# code       *
     *      style.                                              *
     *                                                          *
     * LICENSE:                                                 *
     *      Do what you want with it                            *
     *                                                          *
     ************************************************************/ 
     
    static class Program
    {
        /*
         * x and y postitions of the cursor
         * */
        static int xpos;
        static int ypos;

        /*
         * Cell char
         * */
        static string cellChar = "O";

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
        static bool[,] Cells = new bool[50, 25];

        /*
         * ConsoleKeyInfo object to fetch the key being pressed down
         * */
        static ConsoleKeyInfo cki;

        static void Main(string[] args)
        {
            Console.WriteLine("Move the cursor with the arrow keys and press the spacebar to plant a cell.");
            Console.WriteLine("then press s to start the simulation.");
            Console.WriteLine("press any key to begin");
            Console.ReadKey();
            Console.Clear();
            game_loop();
        }

        /*
         * Read the postition of the cursor in the console.
         * and starts the game when S is pressed.
         * */
        static void read_cursor_position()
        {
            cki = Console.ReadKey();
            if (cki.Key == ConsoleKey.UpArrow)
            {
               /* 
                * Before we change the position of our cursor we must remove the previous
                * char in the console. If not we will leave "lines" behind the cursor
                **/
                remove_char();
                //This if statement is added so that the game doesn't crash if you try to move a cursor outside of the console window.
                //if ypos is 0, nothing happens, and if it is not, cursor can move up.
                if (ypos == 0); //intentionally left empty
                else
                {
                    ypos--;
                }
                
            }

            if (cki.Key == ConsoleKey.DownArrow)
            {
                remove_char();
                ypos++;
            }

            if (cki.Key == ConsoleKey.LeftArrow)
            {
                remove_char();
                if (xpos == 0) ; //intentionally left empty
                else
                {
                    xpos--;
                }
            }

            if (cki.Key == ConsoleKey.RightArrow)
            {
                remove_char();
                xpos++;
            }

            if (cki.Key == ConsoleKey.Spacebar)
            {
                remove_char();
                plant_cell();
            }

            if (cki.Key == ConsoleKey.S)
            {
                while (true)/* we want to loop the algorithm forever when we press the s key */
                {
                    start_algorithm();
                }
            }
        }

        /*
         * Calculates a cells neighbour and return the results.
         * We look around each cell in the boolean cell matrix and count
         * the number of neighbours
         * */
        static int neighbours(int x, int y)
        {
            int neighbours = 0;

            if (Cells[x - 1, y - 1])
            {
                neighbours++;
            }
            if (Cells[x, y - 1])
            {
                neighbours++;
            }
            if (Cells[x + 1, y - 1])
            {
                neighbours++;
            }
            if (Cells[x - 1, y])
            {
                neighbours++;
            }
            if (Cells[x + 1, y])
            {
                neighbours++;
            }
            if (Cells[x - 1, y + 1])
            {
                neighbours++;
            }
            if (Cells[x, y + 1])
            {
                neighbours++;
            }
            if (Cells[x + 1, y + 1])
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
         * cell has two or three lice neighbours it lives on to the next generation. If a living
         * cell has more than three living neighbours it dies. If a dead cell has exactly
         * three living neighbours it becomes alive.
         * 
         * */
        static void start_algorithm()
        {
            /* Allocate a new boolean cell matrix for each new generation */
            bool[,] new_generation = new bool[50, 25];

            for (int x = 1; x < 49; x++)
            {
                for (int y = 1; y < 24; y++)
                {
                    if (Cells[x, y])
                    {
                        /* If a cell is alive we check if it has two or three living neighbours */
                        if (neighbours(x,y) >= 2 && neighbours(x, y) <= 3)
                        {
                            new_generation[x, y] = true;
                        }
                        else/* if not it will die */
                        {
                            new_generation[x, y] = false;
                        }
                    }
                    else
                    {
                        /* If a dead cell has three neighbours it will become alive */
                        if (neighbours(x,y) == 3)
                        {
                            new_generation[x, y] = true;
                        }
                        else /* else it will stay dead */
                        {
                            new_generation[x, y] = false;
                        }
                    }

                    /* draw the next generation of cells on the console */
                    draw_cells(x, y,new_generation);
                }
            }
            /* make the previous generation of cells null */
            Cells = null;
            /* insert the new generation of cells */
            Cells = new_generation;
        }

        /*
         * Draws the cells on the console during the algorithm.
         * We also make sure we do not draw over any living cell.
         * */
        static void draw_cells(int x, int y,bool[,] cells)
        {
            if (cells[x, y] == true)
            {
                Console.SetCursorPosition(x, y);
                Console.WriteLine(cellChar);
            }
            else
            {
                Console.CursorVisible = false;
                Console.SetCursorPosition(x, y);
                Console.WriteLine(" ");
            }
        }

        /*
         * Draws the cursor on the current postion 
         * */
        static void draw_cursor()
        {
            Console.SetCursorPosition(xpos, ypos);
            Console.WriteLine("#");
        }

        /*
         * Plants a cell on the current postition of the cursor
         * */
        static void plant_cell()
        {
            /* make the cell alive */
            Cells[xpos, ypos] = true;
            Console.SetCursorPosition(xpos, ypos);
            Console.WriteLine(cellChar);
        }

        /*
         * Removes the previous char of the cursor 
         * So we do not draw "lines" when we plant cells 
         * */
        static void remove_char()
        {
            Console.SetCursorPosition(xpos, ypos);
            if (Cells[xpos, ypos])
            {
                Console.Write(cellChar);
            }
            else
            {
                Console.Write(" ");
            }
        }

        /*
         * Game loop
         * 
         * the loop that keeps the whole game running.
         * Not to be confused with the algorithm loop.
         * */
        static void game_loop()
        {
            while (true)
            {
                read_cursor_position();
                draw_cursor();
            }
        }
    }
}

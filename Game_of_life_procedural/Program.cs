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
     
    class Program
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
         * Cell array, each cell is a boolean that is either alive or dead.
         * True or False
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
         * Read the postition of the cursor in the console
         * and starts the game when S is pressed
         **/
        static void read_cursor_position()
        {
            cki = Console.ReadKey();
            if (cki.Key == ConsoleKey.UpArrow)
            {
                remove_char();
                ypos--;
            }

            if (cki.Key == ConsoleKey.DownArrow)
            {
                remove_char();
                ypos++;
            }

            if (cki.Key == ConsoleKey.LeftArrow)
            {
                remove_char();
                xpos--;
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
                while (true)
                {
                    start_algorithm();
                }
            }
        }

        /*
         * Calculates a cells neighbour and return the results
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
         * Depending on the number of alive neigbours the outcome of the cell is determined
         * */
        static void start_algorithm()
        {
            bool[,] new_generation = new bool[50, 25];

            for (int x = 1; x < 49; x++)
            {
                for (int y = 1; y < 24; y++)
                {
                    if (Cells[x, y])
                    {
                        if (neighbours(x,y) >= 2 && neighbours(x, y) <= 3)
                        {
                            new_generation[x, y] = true;
                        }
                        else
                        {
                            new_generation[x, y] = false;
                        }
                    }
                    else
                    {
                        if (neighbours(x,y) == 3)
                        {
                            new_generation[x, y] = true;
                        }
                        else
                        {
                            new_generation[x, y] = false;
                        }
                    }

                    draw_cells(x, y,new_generation);
                }
            }
            Cells = null;
            Cells = new_generation;
        }

        /*
         * Draws the cells on the console during game paly
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

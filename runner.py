import messagemaze as mm
your_message = 'Happy new year'
maze = mm.MessageSolutionPath(your_message).maze
maze.show_maze()
maze.generate_maze('rBFS')
maze.show_maze()
maze.export_maze()
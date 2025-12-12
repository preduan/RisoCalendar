Project is hosted live on p5.js: https://editor.p5js.org/mossrice/sketches/ecnhlguZr

This is a Generative Daily Calendar Generator! Using EXIF parsing, the code retrieve the date the photo was created through its metadata. Each calendar page will list the day of the week at the bottom, the upcoming year on top, with the month and date below that. The photo will be situated in the middle.

This is intended for dual-tone riso printing -- since separating the color layers for 365 days would be repetitive work, I calculated the rbg values in a photograph and automatically matched it to the closest riso ink color. Once the dominant color of the photo was chosen, the code automatically applies a specified complimentary color. 

The user can press S to save the file, which will also separate the file into 2 colors for layered risograph printing, simplifying the process without relying on photoshop or other tools.

Further iterations would include: layout improvements, adding more data from the photos to evoke more of the photo memory, adjusting the layout for printing multiple dates at once, and expanding the file intake format to include .heic, .png, etc. as well as image compression/resizing. I hope to expand on this project to be cleaner and to be able to fulfill a full calendar year's worth of memories to look back on.

![Amazing lady guitarist opener on Wednesday, August 19](SamplePhotos/RisoCal_02.jpg)
![Lion dance on Tuesday, February 17](SamplePhotos/RisoCal_03.jpg)
![Yellow and Orange, Red and Blue, and Aqua and Blue duocolor variations of the above photos](SamplePhotos/RisoCal_04.jpg)
![Screen comparison of the original photo of the lady guitarist with the red and blue riso separated version](SamplePhotos/RisoCal_05.jpg)

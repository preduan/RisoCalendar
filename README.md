Project is hosted live on p5.js: https://editor.p5js.org/mossrice/sketches/ecnhlguZr

This is a Generative Daily Calendar Generator! Using EXIF parsing, the code retrieve the date the photo was created through its metadata. Each calendar page will list the day of the week at the bottom, the upcoming year on top, with the month and date below that. The photo will be situated in the middle.

This is intended for dual-tone riso printing -- since separating the color layers for 365 days would be repetitive work, I calculated the rbg values in a photograph and automatically matched it to the closest riso ink color. Once the dominant color of the photo was chosen, the code automatically applies a specified complimentary color. 

The user can press S to save the file, which will also separate the file into 2 colors for layered risograph printing, simplifying the process without relying on photoshop or other tools.

Further iterations would include: layout improvements, adding more data from the photos to evoke more of the photo memory, adjusting the layout for printing multiple dates at once, and expanding the file intake format to include .heic, .png, etc. as well as image compression/resizing. I hope to expand on this project to be cleaner and to be able to fulfill a full calendar year's worth of memories to look back on.

![IMG_9465](https://github.com/user-attachments/assets/52888816-0cfc-45ea-a5b2-de50beb6cd11)
![IMG_9466](https://github.com/user-attachments/assets/577077ce-2615-487a-8fbe-a444c45ec294)
![Screen comparison of the original photo of the lady guitarist with the red and blue riso separated version](SamplePhotos/RisoCal_05.jpg)

<img width="332" height="429.65" alt="genCal1(1)" src="https://github.com/user-attachments/assets/37b3afd6-05f8-44bc-9550-8a3e00cab454" />
<img width="332" height="429.65" alt="genCal4(1)" src="https://github.com/user-attachments/assets/a0b60dc2-d394-4c6f-9a18-cc88fa71cc2c" />
<img width="332" height="429.65" alt="genCal3(1)" src="https://github.com/user-attachments/assets/da2c890c-dc52-4374-86f5-30b9eb9215c8" />
<img width="332" height="429.65" alt="genCal2(1)" src="https://github.com/user-attachments/assets/d55fdd96-f191-47a4-ba39-643f9f911d66" />
<img width="332" height="429.65" alt="genCal5(1)" src="https://github.com/user-attachments/assets/337684d9-d34d-4a20-b578-e6ce04361e54" />
<img width="332" height="429.65" alt="genCal7(1)" src="https://github.com/user-attachments/assets/bf6c64d9-60e4-46f8-bce5-38e60befd5ba" />
<img width="332" height="429.65" alt="genCal8(1)" src="https://github.com/user-attachments/assets/186b695a-7e7e-4c95-8efb-fc003dd36046" />
<img width="332" height="429.65" alt="genCal9(1)" src="https://github.com/user-attachments/assets/abaae202-0495-40cb-84a7-11d5c7c63c5c" />

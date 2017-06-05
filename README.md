# Quizlyio
Simple JS library for creating Buzzfeed style quizes made for Compassion Australia that I thought could be useful for other people too.

See [production version](https://www.compassion.com.au/blog/test-your-knowledge-of-deadly-diseases)

## Usage
Create your quiz html in the format specified by the template and load the Quizlyio JS on the page you want your quiz to work on. It should just work. Pay attention to the data attributes. All usage instructions are located in the template file.

If you need to update Quizlyio update the EC6 file and then use Babel to covert it for backwards compatability. I really like the Class syntax for JS from EC6 and find code much more readable when written using it. 


## Current known issues
- Once you have answered a question if you change your answer to another question it will light up green. This is just a minor fix that I need to get around to doing.
- If elements with specified IDs don't exist it will blowup. This is an actual problem, however with its current usecase in just the Compassion Australia blog it is not something I am terribly concerned with. If I were to turn this into a library for everyone to use I would definately refactor this and add some catches.
- Dependancy on jQuery for initialization. I was in a rush and couldn't remember how to do it off the top of my head in vanilla JS. Another minor fix.
- Need to remove Google Tag Manager event trigger function `recordGTMEvent()` for this repo as that function is specific to where this is used.

## Planed updates
- Fix the question answered bug.
- Add support for multiple answers being correct

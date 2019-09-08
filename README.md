# Autocomplete input element.

## Usage

1. Load the es6 module

    HTML:
    ```html
    <script type="module" src="autocomplete.mjs"/>
    ```
 
    JAVASCRIPT:
    ```javascript 1.7
    (async()=>{
    await import('./autocomplete.mjs');
    })();
    ```

2. Add the element to the DOM

    HTML:
    ```html
    <auto-complete></auto-complete>
    ```
    JAVASCRIPT:
    ```javascript 1.7
    const element = document.createElement('auto-complete');
    parent.appendChild(element);
    ```
    
3. Set up the auto completion.

    JAVASCRIPT:
    
    Specify a list of elements.
    
    ```javascript 1.7
    element.options=[ 'choice 1', 'choice 2', 'choice 3' ];
    ```

    ```javascript 1.7
    element.options=[ 
     { text: 'Choice 1', value: 'choice1' }, 
     { text: 'Choice 2', value: 'choice2' },
     { text: 'Choice 3', value: 'choice3' } 
    ];
    ```
   
   Specify a function that returns a list of elements.
   
   ```javascript 1.7
   element.options=inputValue=>[
     `${inputValue} 1`,
     `${inputValue} 2`,
     `${inputValue} 3`,
   ];       
   ```
   
   ```javascript 1.7
   element.options=inputValue=>{
     return [ 
       { text: `${inputValue} 1`, value: `${inputValue.toLowerCase()}1` }, 
       { text: `${inputValue} 2` value: `${inputValue.toLowerCase()}2` },
       { text: `${inputValue} 3`, value: `${inputValue.toLowerCase()}3` } 
     ];
   };
   ```

    Specify an async function that returns a list of elements.
    
    ```javascript 1.7
    element.options=async inputValue=>{
      const fetch=await fetch(`http://my_api/autocomplete/${encodeURIComponent(inputValue)}`);
      return await fetch.json();
    };
   ```

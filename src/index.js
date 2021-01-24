const axios = require('axios');
const epub = require('epub-gen');

axios.get('http://www.gutenberg.org/files/2701/2701-0.txt').
  then(res => res.data).
  then(text => {
    text = text.slice(text.indexOf('EXTRACTS.'));
    text = text.slice(text.indexOf('CHAPTER 1.'));

    const lines = text.split('\r\n');
    const content = [];
    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      if (line.startsWith('CHAPTER ')) {
        if (content.length) {
          content[content.length - 1].data = content[content.length - 1].data.join('\n');
        }
        content.push({
          title: line,
          data: ['<h2>' + line + '</h2>']
        });
      } else if (line.trim() === '') {
        if (content[content.length - 1].data.length > 1) {
          content[content.length - 1].data.push('</p>');
        }
        content[content.length - 1].data.push('<p>');
      } else {
        content[content.length - 1].data.push(line);
      }
    }

    const options = {
      title: 'Moby-Dick',
      author: 'Herman Melville',
      output: './public/moby-dick.epub',
      cover: './public/moby-dick.png',
      css: `
      * { font-family: 'PT Serif'; }
      p { line-height: 1.5em; }
    `,
    // You need to download the TTF file from Google Fonts
    fonts: ['./fonts/google/PTSerif/PTSerif-Regular.ttf'],
      content
    };

    return new epub(options).promise;
  }).
  then(() => console.log('Feito!'));
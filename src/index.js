import React from "react";
import ReactDOM from "react-dom";
import { createResource, createCache } from "simple-cache-provider";

// https://qiita.com/mizchi/items/89f2ec05f909a8d8dbbe

const Timeout = React.Timeout;
const AsyncMode = React.unstable_AsyncMode;

const cache = createCache();
const hn = createResource(async q => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${q}`;
  const res = await fetch(url);
  await new Promise(resolve => setTimeout(resolve, 400));
  return res.json();
});

const Books = () => {
  const books = hn.read(cache, "オブジェクト志向");
  return (
    <div>
      <p>{books.items[0].volumeInfo.title}</p>
      <img
        src={books.items[0].volumeInfo.imageLinks.thumbnail}
        alt={books.items[0].volumeInfo.title}
      />
    </div>
  );
};

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Try suspense</h1>
        <button
          onClick={() => {
            this.forceUpdate();
          }}
        >
          reload
        </button>
        <hr />
        <Timeout ms={200}>
          {didExpire =>
            didExpire ? <span>The content is still loading :(</span> : <Books />
          }
        </Timeout>
      </div>
    );
  }
}

ReactDOM.render(
  <AsyncMode>
    <App />
  </AsyncMode>,
  document.getElementById("app")
);

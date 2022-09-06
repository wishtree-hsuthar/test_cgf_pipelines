import React from "react";
import Toaster from "./Toaster";

const ToasterTester = () => {
  const myRef = React.useRef({});
  const titleMessage = "hey that's very nice Lorem consectetur assumenda conse nexes patel esnie sveiyns ikk ei aknzcve";
  const descriptionMessage =
    "Lorem assumenda consequuntur necessitatibus consectetur Lorem assumenda consequuntur necessitatibus consectetur Lorem assumenda consequuntur necessitatibus consectetur ?";
  const messageType = "success";
  const onClickHandler = () => {
    myRef.current()
  }
  return (
    <div>
      <Toaster
        myRef={myRef}
        titleMessage={titleMessage}
        descriptionMessage={descriptionMessage}
        messageType={messageType}
      />
      {console.log("render toaster tester")}
      <button onClick={onClickHandler}>Show Toast !</button>
    </div>
  );
};

export default ToasterTester;

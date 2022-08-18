import React from "react";
import DialogBox from "./DialogBox";

const DialogBoxTester = () => {
    //to manage modal
    const [open,setOpen] = React.useState(false)
    
    //on Click of Primary modal button
    const onPrimaryButtonClickHandler = () => {
            console.log("primary button")
    }

    //on Click of Secondary modal button
    const onSecondaryButtonClickHandler = () => {
          console.log("Secondary button")
    }

    //to open modal on button click
    const onClickOpenDialogHandler = () => {
        setOpen(true)
    }
  return (
    <div>
      <DialogBox
        title='Replace Member "KitKat" with Dairy milk lorem bisnoi way of doing it!'
        info="On replacing a member, all the statistics and record would get transfer to the new member. Are you sure you want to replace KitKat? On replacing a member, all the statistics and record would get transfer to the new member. Are you sure you want to replace KitKat? On replacing a member, all the statistics and record would get transfer to the new member. Are you sure you want to replace KitKat?"
        primaryButtonText="Yes"
        secondaryButtonText="No"
        onPrimaryModalButtonClickHandler={onPrimaryButtonClickHandler}
        onSecondaryModalButtonClickHandler={onSecondaryButtonClickHandler}
        openModal={open}
        setOpenModal={setOpen}
      />
      {/* Tester button  */}
      <button onClick={onClickOpenDialogHandler}>Open Dialog</button>
    </div>
  );
};

export default DialogBoxTester;

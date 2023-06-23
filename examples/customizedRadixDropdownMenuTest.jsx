// source: https://near.org/mob.near/widget/WidgetSource?src=calebjacob.near%2Fwidget%2FRadixDropdownMenuTest

State.init({
  bookmarksChecked: true,
  urlsChecked: false,
});

function setBookmarksChecked(value) {
  State.update({ bookmarksChecked: value });
}

function setUrlsChecked(value) {
  State.update({ urlsChecked: value });
}

// const Content = styled("DropdownMenu.Content")`
//   border: 1px solid #000;
//   border-radius: 5px;
//   background: #fff;
//   padding: 8px;
// `;

// const itemStyles = `
//     border-radius: 3px;
//     background: #fff;
//     padding: 8px;
//     cursor: pointer;

//     &:hover {
//         background: #eee;
//     }
// `;

// const CheckboxItem = styled("DropdownMenu.CheckboxItem")`
//   ${itemStyles}
// `;

return (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>My Menu</DropdownMenu.Trigger>
    <DropdownMenu.Content sideOffset={5}>
      <DropdownMenu.CheckboxItem
        checked={state.bookmarksChecked}
        onCheckedChange={setBookmarksChecked}
      >
        <DropdownMenu.ItemIndicator>
          <i className="bi bi-check-circle-fill"></i>
        </DropdownMenu.ItemIndicator>
        Show Bookmarks
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.CheckboxItem
        checked={state.urlsChecked}
        onCheckedChange={setUrlsChecked}
      >
        <DropdownMenu.ItemIndicator>
          <i className="bi bi-check-circle-fill"></i>
        </DropdownMenu.ItemIndicator>
        Show Full URLs
      </DropdownMenu.CheckboxItem>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

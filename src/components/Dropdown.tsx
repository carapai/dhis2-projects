import {
  IconButton, Menu,
  MenuButton,

  MenuItem, MenuList
} from "@chakra-ui/react";
import { FC } from "react";
import { IconType } from "react-icons";

interface Item {
  id: string;
  label: string;
  onClick?: () => void
}

interface DropdownOptions {
  Icon: IconType,
  items: Item[],

}
const Dropdown: FC<DropdownOptions> = ({ Icon, items }) => {
  return (
    <Menu placement="auto-start">
      <MenuButton
        aria-label="Options"
      >
        <Icon fontSize="24px" />
      </MenuButton>
      <MenuList>
        {items.map(({ id, label, onClick }) => <MenuItem key={id} command="⌘T" onClick={onClick}>
          {label}
        </MenuItem>)}
      </MenuList>
    </Menu>
  )
}

export default Dropdown

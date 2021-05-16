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
}

interface DropdownOptions {
  Icon: IconType,
  items: Item[]
}
const Dropdown: FC<DropdownOptions> = ({ Icon, items }) => {
  return (
    <Menu placement="auto-start">
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<Icon />}
        variant="outline"
      />
      <MenuList>
        {items.map(({ id, label }) => <MenuItem key={id} command="⌘T">
          {label}
        </MenuItem>)}
      </MenuList>
    </Menu>
  )
}

export default Dropdown

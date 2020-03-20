import React from 'react';
import { Menu, Icon } from '@codesandbox/components';
import { Authorization } from 'app/graphql/types';

const authToName = {
  [Authorization.WriteCode]: 'Can Edit',
  [Authorization.Comment]: 'Can Comment',
  [Authorization.None]: 'No Access',
  [Authorization.Read]: 'Can View',
  [Authorization.WriteProject]: 'Edit Sandbox Info',
};

// Based on the longest option in the mnu
// which is "Can Comment"
export const MENU_WIDTH = 110;

interface IPermissionSelectProps {
  additionalOptions?: { value: string; label: string }[];
  permissions?: Authorization[];
  pretext?: string;
  value: Authorization;
  onChange: (Authorization) => void;
  disabled?: boolean;
}

export const PermissionSelect = ({
  additionalOptions = [],
  permissions = [Authorization.WriteCode, Authorization.Read],
  value: selectedValue,
  onChange,
  disabled,
  ...props
}: IPermissionSelectProps) => (
  <Menu>
    <Menu.Button disabled={disabled} {...props}>
      {authToName[selectedValue]} <Icon name="caret" size={8} marginLeft={1} />
    </Menu.Button>
    <Menu.List>
      {permissions.map(auth => (
        <Menu.Item key={auth} onSelect={() => onChange(auth)}>
          {authToName[auth]}
        </Menu.Item>
      ))}

      {additionalOptions.map(({ label, value }) => (
        <Menu.Item key={label} onSelect={() => onChange(value)}>
          {label}
        </Menu.Item>
      ))}
    </Menu.List>
  </Menu>
);

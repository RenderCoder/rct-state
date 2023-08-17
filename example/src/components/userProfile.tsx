import {
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input
} from '@chakra-ui/react';
import * as React from 'react';
import { state$ } from '../state';

export function UserProfile() {
  const user = state$.user.use();
  return (
    <Card>
      <CardBody>
        <Heading>User Profile</Heading>

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type="text" value={user.name} />
        </FormControl>

        <FormControl>
          <FormLabel>Age</FormLabel>
          <Input type="number" value={user.age} />
        </FormControl>

        <FormControl>
          <FormLabel>City</FormLabel>
          <Input
            type="text"
            value={user.address.city}
            onChange={(event) => {
              // @ts-ignore
              console.log('## City on change', event.target.value)
              // @ts-ignore
              state$.user.address.city.set(event.target.value);
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Street</FormLabel>
          <Input type="text" value={user.address.street} />
        </FormControl>
      </CardBody>
    </Card>
  );
}

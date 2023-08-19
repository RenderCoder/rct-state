import {
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Button,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { state$ } from '../state';

export function SectionList() {
  const sections = state$.sections.use();
  // console.log('@@@ state$.sections', state$.sections, sections);

  const [newProperty, setNewProperty] = useState('');

  return (
    <Card>
      <CardBody>
        <Heading>Section List</Heading>

        {sections.map((section, index) => {
          return (
            <FormControl key={index}>
              <FormLabel>Section {index}</FormLabel>
              {Object.keys(section).map((key) => {
                return (
                  <Input
                    key={key}
                    type="text"
                    value={(section as any)[key]}
                    onChange={(event) => {
                      // console.log('### state$.sections', state$.sections);
                      // @ts-ignore
                      state$.sections[index][key].set(event.target.value);
                    }}
                  />
                );
              })}
            </FormControl>
          );
        })}

        <Button
          onClick={() => {
            state$.sections.set([...state$.sections.get(), { filePath: '1' }]);
          }}
        >
          Add Section Item
        </Button>

        {/*  */}
        <FormControl>
          <FormLabel>New Property</FormLabel>
          <Input
            type="text"
            value={newProperty}
            onChange={(event) => {
              // @ts-ignore
              setNewProperty(event.target.value);
            }}
          />
        </FormControl>
        <Button
          onClick={() => {
            state$.batch(() => {
              const sectionArray = state$.sections.get();
              const count = sectionArray.length;
              for (let i = 0; i < count; i++) {
                // @ts-ignore
                state$.sections[i].set({
                  ...sectionArray[i],
                  [newProperty]: '',
                });
              }
            });
          }}
        >
          Add Section Key
        </Button>
      </CardBody>
    </Card>
  );
}

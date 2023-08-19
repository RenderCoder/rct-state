import { Card, CardBody, Code, Heading } from '@chakra-ui/react';
import * as React from 'react';
import { state$ } from '../state';

export function StateValue() {
  const stateValue = state$.useSelector((state) => state);
  console.log('# stateValue', stateValue);
  return (
    <Card width="100%">
      <CardBody width="100%">
        <Heading>State Value</Heading>
        <Code width="100%">
          <pre>
            <code>{JSON.stringify(stateValue, null, '  ')}</code>
          </pre>
        </Code>
      </CardBody>
    </Card>
  );
}

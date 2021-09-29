import { Control, Input, Button, Options, Select } from '@plan';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Control>
        <Input label='First input' />
      </Control>
      <Control>
        <Select>
          <Options options={[{ label: '12', value: '123123' }]} selectedValue='12' />
        </Select>
      </Control>
      <Control>
        <Button onClick={() => console.log('click')}>asdasd</Button>
      </Control>
    </>
  );
};

export default Home;

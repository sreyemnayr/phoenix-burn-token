import * as React from 'react';
import Numeral from '@/components/Numeral';

interface INumericDisplay {
  value: number;
  size?: string;
}
  
  export const NumericDisplay = ({value = 0, size}: INumericDisplay) => {
  
    return (
      <div className={`text-center flex justify-center numericDisplay value_${value} h-[20vh]`}>
        {
          value.toString().split('').map((n, i) => (
            <Numeral key={`numeral_${n}_${i}`} value={Number(n)} />
          ))
        }
      </div>
    )
  }
  
  export default NumericDisplay;

import React from 'react';
import { mathReceipt } from '../../../packages/core/src/receipts';
import { recipeToPMB } from '../../../packages/core/src/pmbAssign';
import { encodePMB } from '../lib/pmb/encode';

export default function PMBEncoder({ recipe }: { recipe: any }) {
  React.useEffect(() => {
    const receipt = mathReceipt();
    const payload = recipeToPMB(recipe, receipt);
    encodePMB(payload); // drawing skipped in tests
  }, [recipe]);
  return <div>PMB Encoder</div>;
}

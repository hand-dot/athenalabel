import templatesUtil from '../../utils/template';
import templates from '../../templates';
import dataBefore1 from '../datas/data_before1.json';
import dataAfter1 from '../datas/data_after1.json';
import dataBefore2 from '../datas/data_before2.json';
import dataAfter2 from '../datas/data_after2.json';
import atenaBefore from '../templates/atena_before.json';
import atenaAfter from '../templates/atena_after.json';


describe('isMultiLabel', () => {
  test('Some patterns', () => {
    expect(templatesUtil.isMultiLabel(templates.レターパック)).toEqual(false);
    expect(templatesUtil.isMultiLabel(templates.宛名8面)).toEqual(true);
  });
});

describe('getLabelLengthInPage', () => {
  test('Some patterns', () => {
    expect(templatesUtil.getLabelLengthInPage(templates.レターパック)).toEqual(1);
    expect(templatesUtil.getLabelLengthInPage(templates.宛名8面)).toEqual(8);
  });
});

describe('fmtTemplate', () => {
  test('Some patterns', () => {
    expect(templatesUtil.fmtTemplate(atenaBefore))
      .toEqual(atenaAfter);
  });
});

describe('fmtData', () => {
  test('Some patterns', () => {
    expect(templatesUtil.fmtData(dataBefore1, templates.宛名8面))
      .toEqual(dataAfter1);
    expect(templatesUtil.fmtData(dataBefore2, templates.宛名8面))
      .toEqual(dataAfter2);
  });
});

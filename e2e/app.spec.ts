import { expect, test } from '@playwright/test';

const addExample = async (page: import('@playwright/test').Page) => {
  const help = page.locator('.shortcut-popover');
  if (await help.isVisible()) await help.getByRole('button', { name: 'Đóng' }).click();
  await page.getByRole('button',{name:'Thêm ví dụ'}).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(6);
};

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => { throw error; });
});

test('chạy preset A, điều hướng và bảng bước giải', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('.react-flow__node')).toHaveCount(0);
  await expect(page.locator('.empty')).toHaveCount(0);
  await addExample(page);
  await expect(page.locator('.side-panel')).toHaveCount(0);
  await expect(page.getByTestId('step-status')).toHaveText('0 / 11');
  for (let index=0;index<5;index+=1) await page.getByRole('button',{name:'Tới một bước',exact:true}).click();
  await expect(page.getByTestId('step-status')).toHaveText('5 / 11');
  await page.getByRole('button',{name:'Hiện kết quả'}).click();
  await expect(page.getByRole('heading',{name:'Bảng bước giải'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Giải thích bước'})).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Diễn giải chi tiết từng bước & Truy vết'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Bước 0: Khởi tạo nhãn'})).toBeVisible();
  await expect(page.getByText('Bước 1: Cố định Đỉnh 1 (d = 0)',{exact:true})).toBeVisible();
  const tableScroll=page.locator('.table-scroll');
  expect(await tableScroll.evaluate(element=>getComputedStyle(element).overflow)).toBe('visible');
  expect(await tableScroll.evaluate(element=>getComputedStyle(element).borderTopWidth)).toBe('0px');
  expect(await page.locator('.side-panel').evaluate(element=>element.getBoundingClientRect().width)).toBeGreaterThanOrEqual(700);
  await page.getByRole('button',{name:'Tới một bước',exact:true}).click();
  await page.getByRole('button',{name:'Tới một bước',exact:true}).click();
  await expect(page.getByTestId('step-status')).toHaveText('7 / 11');
  await page.getByRole('button',{name:'Lùi một bước',exact:true}).click();
  await expect(page.getByTestId('step-status')).toHaveText('6 / 11');
  await page.getByRole('button',{name:'Tới bước cuối',exact:true}).click();
  await expect(page.getByTestId('step-status')).toHaveText('11 / 11');
  await expect(page.locator('.side-panel')).toBeVisible();
  await expect(page.locator('.distance-card')).toContainText('10');
  expect(await page.locator('.result').evaluate(element=>getComputedStyle(element).borderTopWidth)).toBe('1px');
  expect(await page.locator('.distance-card').evaluate(element=>getComputedStyle(element).borderTopWidth)).toBe('0px');
  await expect(page.locator('.path-line')).toContainText('1 → 4 → 5 → 6');
  await expect(page.locator('.path-line span')).toHaveCount(0);
  await expect(page.locator('.result .trace-line')).toHaveCount(0);
  await expect(page.getByText('Truy vết đường đi ngắn nhất:',{exact:true})).toBeVisible();
  await expect(page.getByText('➔ Kết luận lộ trình: 1 ➔ 4 ➔ 5 ➔ 6',{exact:true})).toBeVisible();
  await page.locator('.panel-content').evaluate(element=>{element.scrollTop=element.scrollHeight;});
  await page.screenshot({path:testInfo.outputPath('ket-qua-va-dien-giai.png'),fullPage:true});
  await page.getByRole('button',{name:'Chạy'}).click();
  await expect(page.getByTestId('step-status')).toHaveText('0 / 11');
  await expect(page.getByRole('button',{name:'Dừng'})).toBeVisible();
  await page.getByRole('button',{name:'Dừng'}).click();
});

test('chỉnh sửa graph và hoàn tác', async ({ page }) => {
  await page.goto('/');
  await addExample(page);
  const nodes=page.locator('.react-flow__node');
  const sourceOptions=page.locator('.selectors label').filter({hasText:'Nguồn'}).locator('option');
  await expect(nodes).toHaveCount(6);
  await expect(sourceOptions).toHaveCount(7);
  await expect(page.getByRole('button',{name:'Thêm node'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Thêm cạnh'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Thêm ví dụ'})).toBeVisible();
  await page.locator('.react-flow__pane').dblclick({position:{x:650,y:300}});
  await expect(sourceOptions).toHaveCount(8);
  await page.getByRole('button',{name:'Hoàn tác'}).click();
  await expect(sourceOptions).toHaveCount(7);
  await page.getByRole('button',{name:'Vừa khung'}).click();
  await page.locator('.react-flow__node[data-id="1"]').click();
  const sourceHandle=await page.locator('.react-flow__node[data-id="1"] .react-flow__handle-right').boundingBox();
  const targetHandle=await page.locator('.react-flow__node[data-id="6"] .react-flow__handle-left').boundingBox();
  if(!sourceHandle||!targetHandle)throw new Error('Không đo được điểm nối');
  await page.mouse.move(sourceHandle.x+sourceHandle.width/2,sourceHandle.y+sourceHandle.height/2);
  await page.mouse.down();
  await page.mouse.move(targetHandle.x+targetHandle.width/2,targetHandle.y+targetHandle.height/2,{steps:12});
  await page.mouse.up();
  await expect(page.locator('.react-flow__edge')).toHaveCount(11);
  await page.getByRole('button',{name:'Hoàn tác'}).click();
  await expect(page.locator('.react-flow__edge')).toHaveCount(10);
  await nodes.first().locator('.visual-node').dblclick();
  const nodeInput=page.getByRole('textbox',{name:'Sửa nhãn node'}); await nodeInput.fill('Nguồn'); await nodeInput.press('Enter');
  await expect(nodes.first().locator('.node-label')).toHaveText('Nguồn');
  await page.getByRole('button',{name:'Hoàn tác'}).click();
  const firstEdge=page.locator('.edge-label').first();
  await page.locator('.react-flow__edge[data-id="a-e1"] .react-flow__edge-interaction').click({force:true});
  await page.getByRole('toolbar',{name:'Thao tác cạnh'}).getByRole('button',{name:'Sửa trọng số'}).click();
  const input=page.getByRole('textbox',{name:'Sửa trọng số'});
  await input.fill('8'); await input.press('Enter');
  await expect(firstEdge).toHaveText('8');
  await page.getByRole('button',{name:'Hoàn tác'}).click();
  await expect(firstEdge).toHaveText('3');
  const firstNode=nodes.first(); const box=await firstNode.boundingBox();
  if(box){await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+80,box.y+40,{steps:5});const during=await firstNode.boundingBox();expect(during?.x).toBeGreaterThan(box.x+20);await page.mouse.up();}
  expect(await page.locator('.react-flow__edge-path').first().getAttribute('d')).not.toContain('C');
  await expect(nodes.first().locator('.react-flow__handle')).toHaveCount(4);
});

test('xóa bằng Backspace kéo theo cạnh, hỗ trợ Shift chọn nhiều và hoàn tác một lần', async ({ page }) => {
  await page.goto('/');
  await addExample(page);
  await page.locator('.react-flow__node[data-id="1"]').click();
  await page.keyboard.down('Shift');
  await page.locator('.react-flow__node[data-id="2"]').click();
  await page.keyboard.up('Shift');
  await expect(page.locator('.react-flow__node.selected')).toHaveCount(2);
  await expect(page.getByRole('textbox',{name:'Sửa nhãn node'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Xóa phần tử đã chọn'})).toHaveCount(0);
  await page.keyboard.press('Backspace');
  await expect(page.locator('.react-flow__node')).toHaveCount(4);
  await expect(page.locator('.react-flow__edge')).toHaveCount(5);
  await page.getByRole('button',{name:'Hoàn tác'}).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(6);
  await expect(page.locator('.react-flow__edge')).toHaveCount(10);
});

test('hướng dẫn mở mặc định, đủ thao tác desktop/mobile và đổi sáng tối', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Hướng dẫn phím tắt'})).toBeVisible();
  await expect(page.getByText('Tạo node',{exact:true}).first()).toBeVisible();
  await expect(page.getByText('Kéo chấm nối sang node',{exact:true})).toBeVisible();
  await expect(page.getByText('Hướng dẫn thao tác trên điện thoại',{exact:true})).toBeHidden();
  await page.screenshot({path:testInfo.outputPath('huong-dan-mac-dinh.png'),fullPage:true});
  await addExample(page);
  await expect(page.locator('.hints')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Phóng to'})).toBeVisible();
  await page.getByRole('button',{name:'Chuyển sang chế độ tối'}).click();
  await expect(page.locator('.app')).toHaveClass(/theme-dark/);
  const shortcutButton=page.getByRole('button',{name:'Hướng dẫn phím tắt'});
  await expect(shortcutButton.locator('svg')).toBeVisible();
  expect(await shortcutButton.evaluate(element=>getComputedStyle(element).color)).toBe('rgb(242, 123, 75)');
  const openResult=page.getByRole('button',{name:'Mở khu vực kết quả'});
  await expect(openResult.locator('svg')).toBeVisible();
  expect(await openResult.evaluate(element=>getComputedStyle(element).color)).toBe('rgb(242, 123, 75)');
  await page.reload();
  await expect(page.locator('.app')).toHaveClass(/theme-dark/);
  await page.getByRole('button',{name:'Chuyển sang chế độ sáng'}).click();
  await expect(page.locator('.app')).toHaveClass(/theme-light/);
});

test('đổi độ rộng panel và không cho chọn nguồn trùng đích', async ({ page }) => {
  await page.goto('/');
  await addExample(page);
  await page.getByRole('button',{name:'Hiện kết quả'}).click();
  const panel=page.locator('.side-panel');
  expect(await page.locator('tbody td').first().evaluate((element)=>getComputedStyle(element).position)).toBe('static');
  expect(await page.locator('tbody td').nth(1).evaluate((element)=>getComputedStyle(element).position)).toBe('static');
  expect(await page.locator('thead th').first().evaluate((element)=>getComputedStyle(element).left)).toBe('auto');
  const before=await panel.boundingBox();
  const separator=page.getByRole('separator',{name:'Kéo để thay đổi độ rộng canvas và bảng kết quả'});
  const handle=await separator.boundingBox();
  if(!before||!handle)throw new Error('Không đo được panel');
  const resizeY=handle.y+Math.min(120,handle.height*.25);
  await page.mouse.move(handle.x+handle.width/2,resizeY);
  await page.mouse.down();
  await page.mouse.move(handle.x+100,resizeY,{steps:5});
  await page.mouse.up();
  const after=await panel.boundingBox();
  expect(after?.width).toBeLessThan(before.width-70);
  const resizedHandle=await separator.boundingBox();
  if(!resizedHandle)throw new Error('Không đo được separator sau resize');
  const maxY=resizedHandle.y+Math.min(120,resizedHandle.height*.25);
  await page.mouse.move(resizedHandle.x+resizedHandle.width/2,maxY);
  await page.mouse.down();
  await page.mouse.move(0,maxY,{steps:5});
  await page.mouse.up();
  expect((await page.locator('.canvas-area').boundingBox())?.width).toBeGreaterThanOrEqual(470);
  const dock=await page.locator('.canvas-dock').boundingBox();
  const selectors=await page.locator('.selectors').boundingBox();
  if(!dock||!selectors)throw new Error('Không đo được control đáy canvas');
  expect(dock.y+dock.height<=selectors.y||selectors.y+selectors.height<=dock.y||dock.x+dock.width<=selectors.x||selectors.x+selectors.width<=dock.x).toBe(true);
  await expect(page.locator('label').filter({hasText:'Đích'}).locator('option[value="1"]')).toBeDisabled();
});

test('chọn cạnh hiện thanh chỉnh trọng số và xóa, không có đổi chiều', async ({ page }, testInfo) => {
  await page.goto('/');
  await addExample(page);
  await page.locator('.react-flow__edge[data-id="a-e1"] .react-flow__edge-interaction').click({ force: true });
  const toolbar=page.getByRole('toolbar',{name:'Thao tác cạnh'});
  await expect(toolbar).toBeVisible();
  await expect(toolbar.getByRole('button')).toHaveCount(4);
  await expect(toolbar.getByRole('button',{name:'Đổi chiều'})).toHaveCount(0);
  await page.screenshot({path:testInfo.outputPath('thanh-thao-tac-canh.png'),fullPage:true});
  await toolbar.getByRole('button',{name:'Tăng trọng số'}).click();
  await expect(toolbar.getByRole('button',{name:'Sửa trọng số'})).toHaveText('4');
  await toolbar.getByRole('button',{name:'Giảm trọng số'}).click();
  await expect(toolbar.getByRole('button',{name:'Sửa trọng số'})).toHaveText('3');
  await toolbar.getByRole('button',{name:'Xóa cạnh'}).click();
  await expect(page.locator('.react-flow__edge')).toHaveCount(9);
  await page.getByRole('button',{name:'Hoàn tác'}).click();
  await expect(page.locator('.react-flow__edge')).toHaveCount(10);
});

test('fullscreen bật tắt hai chiều và Space chỉ chạy khi nút được focus', async ({ page }) => {
  await page.goto('/');
  await addExample(page);
  await page.locator('.react-flow__pane').click({position:{x:720,y:520}});
  await page.keyboard.press('Space');
  await expect(page.getByTestId('step-status')).toHaveText('0 / 11');
  await expect(page.getByRole('button',{name:'Chạy'})).toBeVisible();
  await page.getByRole('button',{name:'Chạy'}).click();
  await expect(page.getByRole('button',{name:'Dừng'})).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button',{name:'Chạy'})).toBeVisible();
  await page.getByRole('button',{name:'Toàn màn hình'}).click();
  await expect(page.getByRole('button',{name:'Thoát toàn màn hình'})).toBeVisible();
  expect(await page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(true);
  await page.getByRole('button',{name:'Thoát toàn màn hình'}).click();
  await expect(page.getByRole('button',{name:'Toàn màn hình'})).toBeVisible();
  expect(await page.evaluate(()=>Boolean(document.fullscreenElement))).toBe(false);
});

test('hai cạnh cùng cặp node dùng hai làn riêng trên viền node', async ({ page }, testInfo) => {
  await page.goto('/');
  const help=page.locator('.shortcut-popover');
  if(await help.isVisible())await help.getByRole('button',{name:'Đóng'}).click();
  await page.getByLabel('Chọn file JSON').setInputFiles({
    name:'parallel.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({
      version:1,directed:true,
      nodes:[{id:'a',label:'A',x:140,y:280},{id:'b',label:'B',x:620,y:280}],
      edges:[{id:'forward',from:'a',to:'b',weight:4},{id:'backward',from:'b',to:'a',weight:10}],
      source:'a',target:'b'
    }))
  });
  const forward=await page.locator('.react-flow__edge[data-id="forward"] .react-flow__edge-path').getAttribute('d');
  const backward=await page.locator('.react-flow__edge[data-id="backward"] .react-flow__edge-path').getAttribute('d');
  const numbers=(value:string|null)=>(value?.match(/-?\d+(?:\.\d+)?/g)??[]).map(Number);
  const forwardNumbers=numbers(forward);const backwardNumbers=numbers(backward);
  expect(forward).not.toBe(backward);
  expect(Math.abs((forwardNumbers[1]+forwardNumbers[3])/2-(backwardNumbers[1]+backwardNumbers[3])/2)).toBeGreaterThan(8);
  const labels=page.locator('.edge-label');
  const firstBox=await labels.nth(0).boundingBox();const secondBox=await labels.nth(1).boundingBox();
  if(!firstBox||!secondBox)throw new Error('Không đo được nhãn hai cạnh');
  expect(Math.abs(firstBox.y-secondBox.y)).toBeGreaterThan(6);
  await page.screenshot({path:testInfo.outputPath('hai-lan-canh-tren-vien.png'),fullPage:true});
});

test('mobile có nút thùng rác cạnh Nguồn/Đích khi chọn phần tử', async ({ page }, testInfo) => {
  await page.setViewportSize({width:390,height:640});
  await page.goto('/');
  const guideBox=await page.locator('.shortcut-popover').boundingBox();
  const toolbarBox=await page.locator('.toolbar').boundingBox();
  const initialSelectorsBox=await page.locator('.selectors').boundingBox();
  const dockBox=await page.locator('.canvas-dock').boundingBox();
  if(!guideBox||!toolbarBox||!initialSelectorsBox||!dockBox)throw new Error('Không đo được bố cục mobile ban đầu');
  expect(guideBox.y).toBeGreaterThanOrEqual(toolbarBox.y+toolbarBox.height+8);
  expect(guideBox.y+guideBox.height).toBeLessThanOrEqual(initialSelectorsBox.y-8);
  expect(initialSelectorsBox.y+initialSelectorsBox.height).toBeLessThanOrEqual(dockBox.y-8);
  await expect(page.getByRole('heading',{name:'Hướng dẫn thao tác trên điện thoại'})).toBeVisible();
  await expect(page.getByText('Chọn rồi chạm nút thùng rác',{exact:true})).toBeVisible();
  await expect(page.locator('.shortcut-popover').getByText('Hoàn tác',{exact:true})).toBeHidden();
  const guideHeader=page.locator('.shortcut-heading');
  const guideBody=page.locator('.shortcut-body');
  const headerYBefore=(await guideHeader.boundingBox())?.y;
  await guideBody.evaluate((element)=>{ element.scrollTop=element.scrollHeight; });
  expect((await guideBody.evaluate((element)=>element.scrollTop))).toBeGreaterThan(0);
  expect((await guideHeader.boundingBox())?.y).toBe(headerYBefore);
  expect(await page.locator('.shortcut-popover').evaluate((element)=>getComputedStyle(element).overflow)).toBe('hidden');
  await page.screenshot({path:testInfo.outputPath('mobile-huong-dan-khong-chong-lan.png'),fullPage:true});
  await addExample(page);
  await page.locator('.react-flow__node[data-id="1"]').click();
  const remove=page.getByRole('button',{name:'Xóa phần tử đã chọn'});
  await expect(remove).toBeVisible();
  const selectorWidths=await page.locator('.selectors select').evaluateAll((elements)=>elements.map((element)=>element.getBoundingClientRect().width));
  expect(Math.min(...selectorWidths)).toBeGreaterThanOrEqual(120);
  const selectorsBox=await page.locator('.selectors').boundingBox();
  const removeBox=await remove.boundingBox();
  if(!selectorsBox||!removeBox)throw new Error('Không đo được nút xóa mobile');
  expect(selectorsBox.x+selectorsBox.width-(removeBox.x+removeBox.width)).toBeLessThanOrEqual(12);
  const deleteBorders=await remove.evaluate((element)=>{
    const style=getComputedStyle(element);
    return [style.borderTopWidth,style.borderRightWidth,style.borderBottomWidth,style.borderLeftWidth];
  });
  expect(deleteBorders).toEqual(['1px','1px','1px','1px']);
  await page.screenshot({path:testInfo.outputPath('xoa-phan-tu-mobile.png'),fullPage:true});
  await remove.click();
  await expect(page.locator('.react-flow__node')).toHaveCount(5);
});

test('tương tác canvas, reset, anchor cạnh và hướng dẫn phím tắt', async ({ page }) => {
  await page.goto('/');
  await addExample(page);
  await expect(page.locator('.node-distance')).toHaveCount(1);
  await expect(page.locator('.node-distance')).not.toContainText('∞');
  await expect(page.locator('.node-mark')).toHaveCount(1);
  await expect(page.locator('.node-mark')).toHaveText('s');
  expect(await page.locator('.selectors').evaluate(element=>getComputedStyle(element).gap)).toBe('12px');
  expect((await page.locator('.selectors select').first().boundingBox())?.width).toBeGreaterThanOrEqual(118);
  const zoom=page.getByRole('button',{name:'Vừa khung'});
  await expect(zoom).toHaveText('125%');
  const zoomBefore=await zoom.textContent();
  const sourceOptions=page.locator('.selectors label').filter({hasText:'Nguồn'}).locator('option');
  await page.locator('.react-flow__pane').dblclick({position:{x:700,y:300}});
  await expect(sourceOptions).toHaveCount(8);
  await expect(zoom).toHaveText(zoomBefore ?? '100%');

  const firstNode=page.locator('.react-flow__node[data-id="1"] .visual-node');
  await firstNode.hover();
  expect(await firstNode.locator('.react-flow__handle').first().evaluate(element=>getComputedStyle(element).opacity)).toBe('0');
  await firstNode.click();
  await expect(firstNode.locator('.react-flow__handle').first()).toHaveCSS('opacity','1');
  await expect(page.getByRole('textbox',{name:'Sửa nhãn node'})).toHaveCount(0);
  await firstNode.dblclick();
  await expect(page.getByRole('textbox',{name:'Sửa nhãn node'})).toBeVisible();
  await page.keyboard.press('Escape');

  const edgeToSixA=await page.locator('.react-flow__edge[data-id="a-e5"] .react-flow__edge-path').getAttribute('d');
  const edgeToSixB=await page.locator('.react-flow__edge[data-id="a-e8"] .react-flow__edge-path').getAttribute('d');
  expect(edgeToSixA?.split('L').at(-1)).not.toBe(edgeToSixB?.split('L').at(-1));
  const sourceY=[] as number[];
  for(const edgeId of ['a-e1','a-e2','a-e3']){
    const data=await page.locator(`.react-flow__edge[data-id="${edgeId}"] .react-flow__edge-path`).getAttribute('d');
    const match=data?.match(/^M\s*[-\d.]+,([-\d.]+)/);
    if(!match)throw new Error(`Không đọc được điểm đầu của ${edgeId}: ${data}`);
    sourceY.push(Number(match[1]));
  }
  expect(sourceY[0]).toBeLessThan(sourceY[1]);
  expect(sourceY[1]).toBeLessThan(sourceY[2]);

  await page.getByRole('button',{name:'Hướng dẫn phím tắt'}).click();
  await expect(page.getByRole('heading',{name:'Hướng dẫn phím tắt'})).toBeVisible();
  await expect(page.getByText('Backspace',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Reset'}).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(0);
  await expect(sourceOptions).toHaveCount(1);
  await page.getByRole('button',{name:'Thêm ví dụ'}).click();
  await expect(page.locator('.react-flow__node')).toHaveCount(6);
  await expect(sourceOptions).toHaveCount(7);
});

test('đóng mở toàn bộ khu vực kết quả từ runbar và separator', async ({ page }) => {
  await page.goto('/');
  await addExample(page);
  await expect(page.locator('.side-panel')).toHaveCount(0);
  await page.getByRole('button',{name:'Hiện kết quả'}).click();
  await expect(page.getByRole('heading',{name:'Kết quả'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Bảng bước giải'})).toBeVisible();
  await page.getByRole('button',{name:'Đóng khu vực kết quả'}).click();
  await expect(page.locator('.side-panel')).toHaveCount(0);
  await page.getByRole('button',{name:'Mở khu vực kết quả'}).click();
  await expect(page.locator('.side-panel')).toBeVisible();
  await page.getByRole('button',{name:'Đóng khu vực kết quả'}).click();
  await page.getByRole('button',{name:'Tới bước cuối',exact:true}).click();
  await expect(page.locator('.side-panel')).toBeVisible();
});

test('xuất rồi nhập JSON', async ({ page }) => {
  await page.goto('/');
  await addExample(page);
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Xuất'}).click();
  const download=await downloadPromise; const path=await download.path();
  expect(path).not.toBeNull();
  await page.getByLabel('Chọn file JSON').setInputFiles({name:'graph.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,directed:false,nodes:[{id:'x',label:'X',x:100,y:100}],edges:[],source:'x',target:null}))});
  await expect(page.locator('.react-flow__node')).toHaveCount(1);
  await expect(page.locator('.node-label')).toHaveText('X');
  await expect(page.getByTestId('step-status')).toHaveText('0 / 2');
});

test('vùng kết quả dùng tên đỉnh và bảng bước giải chỉ để đọc', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByLabel('Chọn file JSON').setInputFiles({
    name: 'named-vertices.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      version: 1,
      directed: false,
      nodes: [
        { id: 'id-a', label: 'Bắt đầu', x: 120, y: 180 },
        { id: 'id-b', label: 'Trung gian', x: 360, y: 180 },
        { id: 'id-c', label: 'Kết thúc', x: 600, y: 180 },
      ],
      edges: [
        { id: 'edge-a', from: 'id-a', to: 'id-b', weight: 2 },
        { id: 'edge-b', from: 'id-b', to: 'id-c', weight: 3 },
      ],
      source: 'id-a',
      target: 'id-c',
    })),
  });

  await page.getByRole('button', { name: 'Tới bước cuối', exact: true }).click();
  const status = page.getByTestId('step-status');
  await expect(status).toHaveText('5 / 5');
  const table = page.locator('.label-table-section table');
  await expect(table.getByRole('columnheader', { name: 'Đỉnh Bắt đầu', exact: true })).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Đỉnh Trung gian', exact: true })).toBeVisible();
  await expect(table.getByRole('columnheader', { name: 'Đỉnh Kết thúc', exact: true })).toBeVisible();
  await expect(table.locator('button')).toHaveCount(0);
  await table.locator('tbody tr').first().click();
  await expect(status).toHaveText('5 / 5');

  await expect(page.locator('.path-line')).toContainText('Bắt đầu → Trung gian → Kết thúc');
  await expect(page.locator('.detail-trace-line').first()).toContainText('Kết thúc');
  await expect(page.getByText('Bước 1: Cố định Đỉnh Bắt đầu (d = 0)', { exact: true })).toBeVisible();
  await expect(page.getByText('➔ Kết luận lộ trình: Bắt đầu ➔ Trung gian ➔ Kết thúc', { exact: true })).toBeVisible();
  const panelText = await page.locator('.panel-content').innerText();
  expect(panelText).not.toContain('id-a');
  expect(panelText).not.toContain('id-b');
  expect(panelText).not.toContain('id-c');
  await page.locator('.panel-content').evaluate((element) => { element.scrollTop = 0; });
  await page.screenshot({ path: testInfo.outputPath('ten-dinh-trong-bang.png'), fullPage: true });
  await page.locator('.panel-content').evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await page.screenshot({ path: testInfo.outputPath('ten-dinh-trong-ket-qua.png'), fullPage: true });
});

for (const viewport of [{width:1280,height:800},{width:820,height:760},{width:390,height:844}]) {
  test(`không cuộn ngang ở ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport); await page.goto('/'); await addExample(page);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
    if(viewport.width===390){await page.getByRole('button',{name:'Mở khu vực kết quả'}).click();await expect(page.locator('.side-panel')).toHaveClass(/open/);}
    await page.screenshot({path:testInfo.outputPath(`viewport-${viewport.width}.png`),fullPage:true});
  });
}

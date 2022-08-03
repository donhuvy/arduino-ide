import { ContainerModule } from '@theia/core/shared/inversify';
import { ElectronMainMenuFactory as TheiaElectronMainMenuFactory } from '@theia/core/lib/electron-browser/menu/electron-main-menu-factory';
import { ElectronMenuContribution as TheiaElectronMenuContribution } from '@theia/core/lib/electron-browser/menu/electron-menu-contribution';
import { MainMenuManager } from '../../../common/main-menu-manager';
import { ElectronMainMenuFactory } from './electron-main-menu-factory';
import { ElectronMenuContribution } from './electron-menu-contribution';
import { nls } from '@theia/core/lib/common/nls';

import * as remote from '@theia/core/electron-shared/@electron/remote';
import * as dialogs from '@theia/core/lib/browser/dialogs';

Object.assign(dialogs, {
  confirmExit: async () => {
    const messageBoxResult = await remote.dialog.showMessageBox(
      remote.getCurrentWindow(),
      {
        message: nls.localize(
          'theia/core/quitMessage',
          'Any unsaved changes will not be saved.'
        ),
        title: nls.localize(
          'theia/core/quitTitle',
          'Are you sure you want to quit?'
        ),
        type: 'question',
        buttons: [dialogs.Dialog.CANCEL, dialogs.Dialog.YES],
      }
    );
    return messageBoxResult.response === 1;
  },
});

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(ElectronMenuContribution).toSelf().inSingletonScope();
  bind(MainMenuManager).toService(ElectronMenuContribution);
  rebind(TheiaElectronMenuContribution).toService(ElectronMenuContribution);
  bind(ElectronMainMenuFactory).toSelf().inSingletonScope();
  rebind(TheiaElectronMainMenuFactory).toService(ElectronMainMenuFactory);
});

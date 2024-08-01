//from react
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//bpmn-js
import BpmnJS from 'bpmn-js/lib/Modeler';
import { CreateAppendAnythingModule } from '../components/bpmn/libs/create-append/index';
import ColorPickerModule from '../components/bpmn/libs/color-picker/index';

//styles
import '../index.scss';
import './page.scss';
import '../static/extra-styles/button.scss';
import '../../node_modules/bpmn-js/dist/assets/bpmn-js.css';
import '../../node_modules/bpmn-js/dist/assets/diagram-js.css';
import '../../node_modules/bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

//components
import BlurBackground from '../components/homeComponents/dialogs/BlurBackground.tsx';
import { BackHome } from '../components/homeComponents/dialogs/BackHome.tsx';
import RenameDialog from '../components/homeComponents/dialogs/RenameDialog.tsx';
import { DialogOwner } from '../components/homeComponents/dialogs/dialogOwner.ts';
import DeleteDialog from '../components/homeComponents/dialogs/DeleteDialog.tsx';
import SaveDialog from '../components/homeComponents/dialogs/SaveDialog.tsx';

//utils
import { handleBeforeUnload } from '../components/bpmn/utils.ts';

//redux
import dirModelThunk from '../store/dirModel/dirModelThunk.ts';
import { shallowEqual, useDispatch } from 'react-redux';
import bpmnThunk from '../store/bpmn/bpmnThunk.ts';

import { closeBpmn } from '../store/bpmn/bpmnSlice.ts';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { useAppSelector } from '../store/index.ts';

enum DialogType {
  _,
  SPEICHERN,
  UMBENENNEN,
  LOESCHEN,
  BACKHOME,
}

export const BPMN: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLCanvasElement>(null);
  const modelerRef = useRef<BpmnJS | null>(null);
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(
    null
  );
  const createdModel = useAppSelector(
    (state) => state.bpmn.model,
    shallowEqual
  );
  const uploadedModelData = useAppSelector(
    (state) => state.bpmn.uploadedData,
    shallowEqual
  );
  const dispatch = useDispatch<any>();

  const canEdit = useAppSelector((state) => state.user.hasEditRight);

  const getSVG = async () => {
    if (modelerRef.current) {
      const data = await modelerRef.current?.saveSVG();
      return data;
    } else {
      new Error('Modeler instance is null');
    }
  };

  const downloadFile = (
    content: string,
    filename: string,
    type: string
  ) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDiagramData = async () => {
    const xmlResult = await getDiagram();
    const data = xmlResult!.xml;
    await dispatch(bpmnThunk.updateModel(data!));
  };

  const downloadXML = async () => {
    await getDiagramData();
    if (createdModel) {
      const xmlContent = `${createdModel.data}`;
      downloadFile(
        xmlContent,
        `${createdModel.name}.xml`,
        'application/xml'
      );
    } else {
      console.log('downloadXML - error');
    }
  };
  const downloadSVG = async () => {
    const result = await getSVG();
    await getDiagramData();

    if (createdModel && result) {
      const svgString = result.svg;
      const svg = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8',
      });
      saveAs(svg, `${createdModel.name}.svg`);
    } else {
      console.log('downloadSVG - error');
    }
  };
  const downloadPDF = async () => {
    try {
      const result = await getSVG();
      await getDiagramData();

      if (createdModel && result) {
        const diagramName = createdModel.name + '.pdf';
        const svgString = result.svg;
        const svg = new Blob([svgString], {
          type: 'image/svg+xml;charset=utf-8',
        });
        const canvas = downloadRef.current;
        const ctx = canvas!.getContext('2d');
        const domURL = self.URL || self.webkitURL || self;
        const img = new Image();

        // @ts-ignore
        let url = domURL.createObjectURL(svg);
        img.src = url;

        img.onload = async function () {
          if (canvas && ctx) {
            const scaleFactor = 2;
            ctx.canvas.width = img.width * scaleFactor;
            ctx.canvas.height = img.height * scaleFactor;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let png = new Image();
            png.src = canvas.toDataURL('image/png', 1.0);
            const response = await fetch(png.src);
            const image = await response.blob();
            // @ts-ignore
            url = domURL.createObjectURL(image);
            const picture = new Image();
            picture.src = url;
            const doc = new jsPDF(
              'l',
              'px',
              [canvas.width, canvas.height],
              true
            );

            picture.onload = function () {
              doc.addImage(
                picture,
                'PNG',
                20,
                20,
                picture.width - 40,
                picture.height - 40
              );
              doc.save(diagramName);
            };
          } else {
            console.error('Canvas or context not found');
          }
        };
      } else {
        console.error('Initial model or result is missing');
      }
    } catch (error) {
      console.error(
        'An error occurred while downloading the PDF:',
        error
      );
    }
  };

  const close = () => {
    dispatch(closeBpmn());
  };

  const closeGlobalDialog = () => {
    setActiveDialog(null);
  };

  const getDiagram = async () => {
    if (modelerRef.current) {
      const data = await modelerRef.current.saveXML({ format: true });
      return data;
    } else {
      new Error('Modeler instance is null');
    }
  };

  const closeDialog = async () => {
    const newData = await getDiagram();

    if (!canEdit) {
      close();
      return;
    }

    if (typeof createdModel === 'undefined') {
      setActiveDialog(DialogType.SPEICHERN);
    } else if (
      typeof newData !== 'undefined' &&
      createdModel.data === newData.xml
    ) {
      close();
    } else {
      setActiveDialog(DialogType.BACKHOME);
    }
  };

  const handleRenameButton = () => {
    setActiveDialog(DialogType.UMBENENNEN);
  };

  useEffect(() => {
    if (containerRef.current !== null) {
      modelerRef.current = new BpmnJS({
        container: containerRef.current,
        keyboard: {
          bindTo: window,
        },
        additionalModules: [
          CreateAppendAnythingModule,
          ColorPickerModule,
        ],
      });

      if (createdModel) {
        modelerRef.current.importXML(createdModel.data);
      } else if (uploadedModelData) {
        modelerRef.current.importXML(uploadedModelData);
      } else {
        modelerRef.current.createDiagram();
      }

      window.addEventListener('beforeunload', handleBeforeUnload);
      // Cleanup on component unmount
      return () => {
        if (modelerRef.current !== null) {
          window.removeEventListener(
            'beforeunload',
            handleBeforeUnload
          );
          modelerRef.current.destroy();
        }
      };
    } else {
      console.error('Canvas container is not available');
    }
  }, []);

  const onClickSave = async () => {
    if (!createdModel) {
      setActiveDialog(DialogType.SPEICHERN);
      return;
    }

    const result = await getDiagram();

    if (createdModel?.data === result) {
      toast.warning('Diagramm wurde nicht geändert');
      setTimeout(() => {
        close();
      }, 2000);
    } else if (result) {
      try {
        const data = result.xml;
        if (!data) throw new Error();
        dispatch(bpmnThunk.updateModel(data));
        toast.success('Diagramm wurde gespeichert', {
          autoClose: 2000, // Dauer in Millisekunden (2 Sekunden)
        });
      } catch (error) {
        toast.error(`Diagramm wurde nicht gespeichert: ${error}`);
      }
    } else {
      toast.error('Diagramm wurde nicht gespeichert');
    }
  };

  const handleDeleteButton = () => {
    setActiveDialog(DialogType.LOESCHEN);
  };

  const Dialog = () => {
    const modelsInSameDir = useAppSelector(
      (state) => state.dirModel.containedModels
    );
    const usedNamesForModels = Object.values(modelsInSameDir).map(
      (model) => model.name
    );

    const handleBackhome = async () => {
      const result = await getDiagram();
      if (result && result.xml) {
        dispatch(bpmnThunk.updateModel(result.xml));
        toast.success('Diagramm wurde gespeichert', {
          autoClose: 2000, // Dauer in Millisekunden (2 Sekunden)
        });
        setTimeout(() => {
          close();
        }, 2000);
      }
    };

    const handleRename = (newName: string) => () => {
      if (!createdModel) return;

      if (usedNamesForModels.includes(newName)) {
        toast.error('This name is already used');
        return;
      }

      dispatch(
        dirModelThunk.renameModel({
          id: createdModel.id,
          name: newName,
        })
      );
      closeDialog();
    };

    const handleAddNewModel = (name: string) => async () => {
      /*closeDialog();*/

      const result = await getDiagram();
      if (result && result.xml) {
        dispatch(
          bpmnThunk.addModel({
            name,
            description: '',
            xmlData: result.xml,
          })
        );
        toast.success('Diagramm wurde gespeichert', {
          autoClose: 2000, // Dauer in Millisekunden (2 Sekunden)
        });
        setTimeout(() => {
          close();
        }, 2000);
      }
    };

    const handleDelete = () => {
      dispatch(
        dirModelThunk.deleteModel(createdModel ? createdModel.id : -1)
      );
      closeDialog();
    };

    switch (activeDialog) {
      case DialogType.UMBENENNEN:
        return (
          <RenameDialog
            dialogOwner={DialogOwner.MODEL}
            currentName={createdModel ? createdModel.name : ''}
            handleSubmit={handleRename}
            closeDialog={closeGlobalDialog}
          />
        );

      case DialogType.LOESCHEN:
        return (
          <DeleteDialog
            dialogOwner={DialogOwner.MODEL}
            handleSubmit={handleDelete}
            closeDialog={closeGlobalDialog}
          />
        );

      case DialogType.BACKHOME:
        return (
          <BackHome
            closeDialog={close}
            handleSubmit={handleBackhome}
          />
        ); // Das Diagramm sollte vor dem Request vergleicht wird

      case DialogType.SPEICHERN:
        return (
          <SaveDialog
            closeDialog={close}
            handleSubmit={handleAddNewModel}
          />
        );

      default:
        return;
    }
  };

  return (
    <div className="bpmn-container">
      <canvas ref={downloadRef} id="image"></canvas>
      <div ref={containerRef} id="canvas"></div>
      <div className="buttons-bpmn">
        <button
          className="custom-button green-button"
          onClick={closeDialog}
        >
          Home
        </button>
        {canEdit && (
          <>
            <button
              className="custom-button green-button"
              onClick={onClickSave}
            >
              {createdModel ? 'Speichern' : 'Erstellen'}
            </button>
            {createdModel && (
              <>
                <button
                  className="custom-button green-button"
                  onClick={handleRenameButton}
                >
                  Umbenennen
                </button>
                <button
                  className="custom-button green-button"
                  onClick={handleDeleteButton}
                >
                  Löschen
                </button>
                <button
                  className="custom-button green-button"
                  onClick={downloadXML}
                >
                  XML exportieren
                </button>
                <button
                  className="custom-button green-button"
                  onClick={downloadPDF}
                >
                  PDF veröffentlichen
                </button>
                <button
                  className="custom-button green-button"
                  onClick={downloadSVG}
                >
                  SVG exportieren
                </button>
              </>
            )}
          </>
        )}
      </div>
      <ToastContainer />
      {activeDialog &&
        createPortal(
          <BlurBackground handleOutsideClick={closeGlobalDialog}>
            <Dialog />
          </BlurBackground>,
          document.body
        )}
    </div>
  );
};

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ModelMetadata, ModelReturnType } from '../../models/model';
import { camelize } from '../camelizer';
import { LoadingState } from '../appStatusSlice';
import { RootState } from '..';

const API_URL = import.meta.env.VITE_API_URL;

const bpmnThunk = {
  loadModelById: createAsyncThunk<
    ModelReturnType,
    number,
    {
      state: RootState;
    }
  >(
    'bpmn/loadModelById',
    async (modelId, { getState, rejectWithValue }) => {
      const { containedModels } = getState().dirModel;
      const { loading } = getState().appStatus;

      if (loading !== LoadingState.PENDING) {
        return rejectWithValue(undefined);
      }

      try {
        const response = await fetch(
          `${API_URL}/api/v1/models/${modelId}`,
          {
            credentials: 'include',
          }
        );
        if (response.ok)
          return camelize(await response.json()) as ModelReturnType;
        throw new Error();
      } catch (error) {
        return rejectWithValue(
          `Failed to open model "${containedModels[modelId].name}"`
        );
      }
    }
  ),

  addModel: createAsyncThunk<
    ModelMetadata,
    {
      name: string;
      description: string;
      xmlData: string;
    },
    {
      state: RootState;
    }
  >(
    'bpmn/addModel',
    async (
      { name, description, xmlData },
      { getState, rejectWithValue }
    ) => {
      const { currentInode } = getState().dirModel;
      const { loading } = getState().appStatus;

      if (loading !== LoadingState.PENDING) {
        return rejectWithValue(undefined);
      }

      try {
        const file = new File([xmlData], name);

        let formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('dir_inode', `${currentInode}`);
        formData.append('description', description);

        const response = await fetch(`${API_URL}/api/v1/models/`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (response.ok) {
          return (await response.json()) as ModelMetadata;
        }
        throw new Error();
      } catch (error) {
        return rejectWithValue(`Failed to add new model`);
      }
    }
  ),

  updateModel: createAsyncThunk<
    string,
    string,
    {
      state: RootState;
    }
  >(
    'bpmn/updateModel',
    async (xmlData, { getState, rejectWithValue }) => {
      const { loading } = getState().appStatus;
      const { model } = getState().bpmn;

      if (loading !== LoadingState.PENDING) {
        return rejectWithValue(undefined);
      }

      try {
        const file = new File([xmlData], model!.name);

        let formData = new FormData();
        formData.append('id', `${model!.id}`);
        formData.append('file', file);

        const response = await fetch(`${API_URL}/api/v1/models/`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        });
        if (response.ok) {
          return xmlData;
        }
        throw new Error();
      } catch (error) {
        return rejectWithValue(
          `Failed to update model "${model!.name}"`
        );
      }
    }
  ),
};

export default bpmnThunk;

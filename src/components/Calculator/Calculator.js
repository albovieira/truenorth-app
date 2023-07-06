

import React, { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import './Calculator.css';
import ReactQuill from 'react-quill';
import { Button, Grid } from '@material-ui/core';
import { toast } from 'react-toastify';
import apiClient from '../../utils/api';

const Calculator = () => {
    const [text, setText] = useState(`<p><br></p><p>#</p>`);
    let editorRef = useRef(null);

    useEffect(() => {
        const editor = editorRef.current.getEditor();
        const container = editor.container;

        editor.enable(false);
        container.setAttribute('contenteditable', 'false');

        const content = editor.getText();
        const firstLineEndIndex = content.indexOf('\n');
        editor.enable(true);
        editor.formatLine(0, 'author', true);
        editor.setSelection(0, firstLineEndIndex);
    }, []);

    const handleChange = (value) => {
        const lines = value.split('\n');
        const firstLine = lines[0];
        setText(firstLine);
    };

    const handleKeyboard = (event) => {
        const allowedKeys = /[0-9*+\-\/√?]/;
        const key = event.key;

        const editor = editorRef.current.getEditor();
        const selection = editor.getSelection();

        const content = editor.getText();
        const allLines = content.split('\n');
        const commentLineIndex = allLines.findIndex(line => line.includes('#'));

        const currentLineIndex = editor.getLine(selection.index);
        const currentLine = currentLineIndex[0].domNode.textContent;
        if (currentLine.includes('#')) {
            event.preventDefault();
            return;
        }

        // reset second line
        allLines[commentLineIndex] = '#';
        const updatedContent = allLines.join('\n');
        editor.setText(updatedContent);
        editor.setSelection(selection);

        const isArrowKey = (key) => {
            const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            return arrowKeys.includes(key);
        };

        if (!(allowedKeys.test(key) || key === 'Delete' || key === 'Backspace' || isArrowKey(key))) {
            event.preventDefault();
        }
    };

    const executeFormula = async (formula) => {
        try {
            const response = await apiClient.post('/calculator', { formula });
            toast.success('Operation executed successfully');
            return response.data;
        } catch (error) {
            console.log(error);
            toast.error('Error executing operation');
            return {}
            // throw error;
        }
    }

    const handleCalculate = async () => {
        const editor = editorRef.current.getEditor();

        const lines = editor.getText().split('\n');

        const { result } = await executeFormula(lines[0]);
        if(!result) {
            return;
        }
        const comment = `# ${result}`;
        if (lines.length >= 2) {
            lines.splice(1, 1, comment);

            const newContent = lines.join('\n');
            editor.setText(newContent);

            const endPosition = lines[1].length;
            editor.setSelection(1, endPosition);
            editor.setSelection(0, 0);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} className>
                <div className='text-editor-container'>
                    <ReactQuill
                        theme="snow"
                        className="text-editor"
                        value={text}
                        ref={editorRef}
                        onChange={handleChange}
                        onKeyDown={handleKeyboard}
                        placeholder="Start typing..."
                        modules={{
                            toolbar: false
                        }}
                    />
                </div>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end">
                <Button onClick={handleCalculate} variant="contained" color="primary">
                    Calculate
                </Button>
            </Grid>
        </Grid>

    );
};

export default Calculator;

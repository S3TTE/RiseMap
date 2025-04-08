import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Timeline } from 'primereact/timeline';

const RecentNotes = ({ notes: initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [noteDialog, setNoteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  const noteTypes = [
    { label: 'Task', value: 'task', icon: 'pi pi-check-square' },
    { label: 'Meeting', value: 'meeting', icon: 'pi pi-users' },
    { label: 'Idea', value: 'idea', icon: 'pi pi-lightbulb' },
    { label: 'Issue', value: 'issue', icon: 'pi pi-exclamation-circle' },
    { label: 'Success', value: 'success', icon: 'pi pi-check-circle' }
  ];
  
  const teamMembers = [
    { label: 'Alice', value: 'Alice' },
    { label: 'Bob', value: 'Bob' },
    { label: 'Charlie', value: 'Charlie' },
    { label: 'Diana', value: 'Diana' }
  ];
  
  const getIconClass = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.icon : 'pi pi-comment';
  };
  
  const openNewNote = () => {
    setSelectedNote({
      id: Date.now().toString(),
      title: '',
      content: '',
      type: 'task',
      author: '',
      date: new Date().toISOString().split('T')[0],
      relatedTo: ''
    });
    setNoteDialog(true);
  };
  
  const openEditNote = (note) => {
    setSelectedNote({...note});
    setNoteDialog(true);
  };
  
  const saveNote = () => {
    const newNotes = [...notes];
    const index = newNotes.findIndex(n => n.id === selectedNote.id);
    
    if (index >= 0) {
      newNotes[index] = {...selectedNote};
    } else {
      newNotes.unshift({...selectedNote});
    }
    
    setNotes(newNotes);
    setNoteDialog(false);
    
    // Here you would update your backend via API call
  };
  
  const deleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
    // Here you would update your backend via API call
  };
  
  const customizedMarker = (item) => {
    return (
      <span className="custom-marker p-shadow-2" style={{ backgroundColor: getTypeColor(item.type) }}>
        <i className={getIconClass(item.type)}></i>
      </span>
    );
  };
  
  const getTypeColor = (type) => {
    switch(type) {
      case 'task': return '#2196f3';
      case 'meeting': return '#ff9800';
      case 'idea': return '#4caf50';
      case 'issue': return '#f44336';
      case 'success': return '#8bc34a';
      default: return '#9c27b0';
    }
  };
  
  const getTypeLabel = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.label : type;
  };
  
  const customizedContent = (item) => {
    return (
      <Card title={item.title} style={{ margin: '8px 0' }}>
        <div style={styles.noteContent}>
          <div style={styles.noteInfo}>
            <span style={styles.noteType}>{getTypeLabel(item.type)}</span>
            <span style={styles.noteDate}>{item.date}</span>
            <span style={styles.noteAuthor}>by {item.author}</span>
            {item.relatedTo && <span style={styles.noteRelated}>Related to: {item.relatedTo}</span>}
          </div>
          <p>{item.content}</p>
          <div style={styles.noteActions}>
            <Button 
               icon="pi pi-pencil" 
               className="p-button-rounded p-button-text p-button-sm" 
               onClick={() => openEditNote(item)}
             />
             <Button 
               icon="pi pi-trash" 
               className="p-button-rounded p-button-text p-button-danger p-button-sm" 
               onClick={() => deleteNote(item.id)}
             />
           </div>
         </div>
       </Card>
     );
   };
   
   return (
     <View style={styles.container}>
       <Button 
         label="Add Note" 
         icon="pi pi-plus" 
         onClick={openNewNote} 
         style={styles.addButton} 
       />
       
       <Timeline 
         value={notes} 
         align="left" 
         className="customized-timeline" 
         marker={customizedMarker} 
         content={customizedContent} 
       />
       
       {/* Note Dialog */}
       <Dialog 
         header={selectedNote?.id ? 'Edit Note' : 'New Note'} 
         visible={noteDialog} 
         style={{width: '50vw'}} 
         onHide={() => setNoteDialog(false)}
         footer={
           <div>
             <Button label="Cancel" icon="pi pi-times" onClick={() => setNoteDialog(false)} className="p-button-text" />
             <Button label="Save" icon="pi pi-check" onClick={saveNote} />
           </div>
         }
       >
         {selectedNote && (
           <div className="p-fluid">
             <div className="p-field" style={styles.formField}>
               <label htmlFor="note-title">Title</label>
               <InputText 
                 id="note-title" 
                 value={selectedNote.title} 
                 onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})} 
                 required 
               />
             </div>
             
             <div className="p-field" style={styles.formField}>
               <label htmlFor="note-content">Content</label>
               <InputTextarea 
                 id="note-content" 
                 value={selectedNote.content} 
                 onChange={(e) => setSelectedNote({...selectedNote, content: e.target.value})} 
                 rows={5} 
               />
             </div>
             
             <div className="p-field" style={styles.formField}>
               <label htmlFor="note-type">Type</label>
               <Dropdown 
                 id="note-type" 
                 value={selectedNote.type} 
                 options={noteTypes} 
                 onChange={(e) => setSelectedNote({...selectedNote, type: e.value})} 
                 placeholder="Select Type" 
               />
             </div>
             
             <div className="p-field" style={styles.formField}>
               <label htmlFor="note-author">Author</label>
               <Dropdown 
                 id="note-author" 
                 value={selectedNote.author} 
                 options={teamMembers} 
                 onChange={(e) => setSelectedNote({...selectedNote, author: e.value})} 
                 placeholder="Select Author" 
               />
             </div>
             
             <div className="p-field" style={styles.formField}>
               <label htmlFor="note-date">Date</label>
               <InputText 
                 id="note-date" 
                 value={selectedNote.date} 
                 onChange={(e) => setSelectedNote({...selectedNote, date: e.target.value})} 
                 type="date" 
               />
             </div>
             
             <div className="p-field" style={styles.formField}>
               <label htmlFor="note-related">Related To</label>
               <InputText 
                 id="note-related" 
                 value={selectedNote.relatedTo} 
                 onChange={(e) => setSelectedNote({...selectedNote, relatedTo: e.target.value})} 
                 placeholder="Project or task name" 
               />
             </div>
           </div>
         )}
       </Dialog>
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     padding: 8,
   },
   addButton: {
     marginBottom: 16,
   },
   noteContent: {
     position: 'relative',
   },
   noteInfo: {
     display: 'flex',
     flexWrap: 'wrap',
     gap: 8,
     marginBottom: 8,
   },
   noteType: {
     fontWeight: 'bold',
   },
   noteDate: {
     color: '#666',
   },
   noteAuthor: {
     fontStyle: 'italic',
   },
   noteRelated: {
     backgroundColor: '#f0f0f0',
     padding: '2px 6px',
     borderRadius: 4,
   },
   noteActions: {
     display: 'flex',
     justifyContent: 'flex-end',
     marginTop: 8,
   },
   formField: {
     marginBottom: 16,
   }
 });
 
 export default RecentNotes;
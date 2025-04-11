
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Chips } from 'primereact/chips';
import { addDays, format, getISOWeek, getYear, startOfWeek } from 'date-fns';
import { DataService } from '../services/DataService';
import { WeeklyNote } from '../models/WeeklyNote';
import { Task } from '../models/Task';

const WeeklyNotes: React.FC = () => {
  const [weeklyNotes, setWeeklyNotes] = useState<WeeklyNote[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [displayNoteDialog, setDisplayNoteDialog] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<WeeklyNote | null>(null);
  const [isNewNote, setIsNewNote] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const notesData = await DataService.getWeeklyNotes();
        const tasksData = await DataService.getTasks();
        
        setWeeklyNotes(notesData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching weekly notes data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getCurrentWeekNumber = (date: Date) => {
    return `Week ${getISOWeek(date)}`;
  };

  const getCurrentYear = (date: Date) => {
    return getYear(date);
  };

  const getWeekDateRange = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = addDays(start, 6);
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const findNoteForSelectedWeek = () => {
    const weekNumber = getCurrentWeekNumber(selectedWeek);
    const year = getCurrentYear(selectedWeek);
    return weeklyNotes.find(note => note.week === weekNumber && note.year === year);
  };

  const showNoteDialog = (isNew: boolean) => {
    if (isNew) {
      const weekNumber = getCurrentWeekNumber(selectedWeek);
      const year = getCurrentYear(selectedWeek);
      setSelectedNote({
        id: `note-${Date.now()}`,
        week: weekNumber,
        year: year,
        accomplishments: [],
        challenges: [],
        nextWeekPlan: [],
        taskReferences: [],
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
      setIsNewNote(true);
    } else {
      const note = findNoteForSelectedWeek();
      if (note) {
        setSelectedNote(note);
        setIsNewNote(false);
      } else {
        // If no note exists for the selected week, create a new one
        showNoteDialog(true);
        return;
      }
    }
    setDisplayNoteDialog(true);
  };

  const hideNoteDialog = () => {
    setSelectedNote(null);
    setDisplayNoteDialog(false);
  };

  const saveNote = () => {
    if (selectedNote) {
      if (isNewNote) {
        setWeeklyNotes([...weeklyNotes, selectedNote]);
      } else {
        setWeeklyNotes(weeklyNotes.map(note => 
          note.id === selectedNote.id ? selectedNote : note
        ));
      }
      hideNoteDialog();
    }
  };

  const noteDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideNoteDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveNote} />
    </>
  );

  const getTasksForReferences = (taskReferences: string[]) => {
    return tasks.filter(task => taskReferences.includes(task.id));
  };

  const renderSection = (title: string, items: string[]) => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        {items.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {items.map((item, i) => (
              <li key={i} className="text-gray-700">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No items added yet.</p>
        )}
      </div>
    );
  };

  const currentNote = findNoteForSelectedWeek();

  return (
    <div className="weekly-notes">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800">Weekly Notes</h1>
        <div className="flex gap-2">
          <Calendar 
            value={selectedWeek} 
            onChange={(e) => e.value && setSelectedWeek(e.value as Date)} 
            showIcon 
            dateFormat="yy-ww" 
            placeholder="Select Week"
            className="w-auto"
          />
          <Button 
            label={currentNote ? "Edit Note" : "Add Note"} 
            icon={currentNote ? "pi pi-pencil" : "pi pi-plus"} 
            onClick={() => showNoteDialog(!currentNote)}
          />
        </div>
      </div>
      
      <Card className="shadow-md mb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-sakai-primary">
            {getCurrentWeekNumber(selectedWeek)}, {getCurrentYear(selectedWeek)}
          </h2>
          <div className="text-lg text-gray-600">{getWeekDateRange(selectedWeek)}</div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <i className="pi pi-spin pi-spinner text-4xl"></i>
          </div>
        ) : currentNote ? (
          <div>
            {renderSection("Accomplishments", currentNote.accomplishments)}
            {renderSection("Challenges", currentNote.challenges)}
            {renderSection("Next Week's Plan", currentNote.nextWeekPlan)}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Related Tasks</h3>
              {currentNote.taskReferences.length > 0 ? (
                <div className="space-y-2">
                  {getTasksForReferences(currentNote.taskReferences).map(task => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No tasks referenced.</p>
              )}
            </div>
            
            <div className="text-right text-sm text-gray-500">
              Last updated: {new Date(currentNote.lastUpdated).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-60">
            <i className="pi pi-file-edit text-4xl mb-4 text-gray-400"></i>
            <p className="text-gray-500 mb-4">No notes for this week yet.</p>
            <Button 
              label="Create Weekly Note" 
              icon="pi pi-plus" 
              onClick={() => showNoteDialog(true)}
              className="p-button-outlined"
            />
          </div>
        )}
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {weeklyNotes.slice(0, 4).map(note => (
          <Card key={note.id} className="shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={() => {
            // Find a date in the correct week to set as selectedWeek
            const currentDate = new Date();
            currentDate.setFullYear(note.year);
            // Find a week that matches the week number
            const weekNum = parseInt(note.week.replace('Week ', ''));
            const targetDate = new Date(note.year, 0, 1);
            targetDate.setDate(targetDate.getDate() + (weekNum - 1) * 7);
            
            setSelectedWeek(targetDate);
          }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-sakai-primary">{note.week}, {note.year}</h3>
                <p className="text-sm text-gray-500 mt-1">Created: {new Date(note.created).toLocaleDateString()}</p>
              </div>
              <Button 
                icon="pi pi-arrow-right" 
                className="p-button-rounded p-button-text p-button-sm" 
                aria-label="View"
              />
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-gray-600 line-clamp-3">
                {note.accomplishments.length} accomplishments, {note.challenges.length} challenges, {note.taskReferences.length} tasks referenced
              </p>
            </div>
          </Card>
        ))}
      </div>
      
      <Dialog 
        visible={displayNoteDialog} 
        header={`${isNewNote ? 'Create' : 'Edit'} Weekly Note`} 
        modal 
        style={{ width: '90%', maxWidth: '700px' }} 
        footer={noteDialogFooter}
        onHide={hideNoteDialog}
      >
        {selectedNote && (
          <div className="p-fluid">
            <div className="field mb-4">
              <label className="font-medium text-gray-700 mb-2 block">Week</label>
              <div className="flex gap-2">
                <InputText value={selectedNote.week} disabled className="w-1/2" />
                <InputText value={selectedNote.year.toString()} disabled className="w-1/2" />
              </div>
            </div>
            
            <div className="field mb-4">
              <label htmlFor="accomplishments" className="font-medium text-gray-700 mb-2 block">Accomplishments</label>
              <Chips 
                id="accomplishments" 
                value={selectedNote.accomplishments} 
                onChange={(e) => setSelectedNote({ ...selectedNote, accomplishments: e.value || [] })} 
                placeholder="Add an accomplishment and press Enter"
                separator=","
                className="w-full"
              />
            </div>
            
            <div className="field mb-4">
              <label htmlFor="challenges" className="font-medium text-gray-700 mb-2 block">Challenges</label>
              <Chips 
                id="challenges" 
                value={selectedNote.challenges} 
                onChange={(e) => setSelectedNote({ ...selectedNote, challenges: e.value || [] })} 
                placeholder="Add a challenge and press Enter"
                separator=","
                className="w-full"
              />
            </div>
            
            <div className="field mb-4">
              <label htmlFor="nextWeekPlan" className="font-medium text-gray-700 mb-2 block">Next Week's Plan</label>
              <Chips 
                id="nextWeekPlan" 
                value={selectedNote.nextWeekPlan} 
                onChange={(e) => setSelectedNote({ ...selectedNote, nextWeekPlan: e.value || [] })} 
                placeholder="Add a plan item and press Enter"
                separator=","
                className="w-full"
              />
            </div>
            
            <div className="field mb-4">
              <label htmlFor="taskReferences" className="font-medium text-gray-700 mb-2 block">Referenced Tasks</label>
              <Dropdown 
                id="taskReferences" 
                value={selectedNote.taskReferences} 
                options={tasks.map(task => ({ label: task.title, value: task.id }))} 
                onChange={(e) => setSelectedNote({ ...selectedNote, taskReferences: e.value })} 
                placeholder="Select Tasks"
                className="w-full"
                filter
                showClear
                multiple
              />
            </div>
            
            {selectedNote.taskReferences && selectedNote.taskReferences.length > 0 && (
              <div className="field mb-4">
                <label className="font-medium text-gray-700 mb-2 block">Selected Tasks</label>
                <div className="space-y-2">
                  {getTasksForReferences(selectedNote.taskReferences).map(task => (
                    <div key={task.id} className="p-2 bg-gray-50 rounded-lg">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{task.status} - Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default WeeklyNotes;

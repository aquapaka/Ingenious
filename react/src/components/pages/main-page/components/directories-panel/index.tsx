import { Accordion } from '@/components/ui/accordion';
import { useGetUserDataQuery } from '@/services/main-service';
import Fuse from 'fuse.js';
import { Bug, Ghost, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import { noteSearchFuseOptions } from '../../../../../const/config';
import CreateNewDirectoryButton from './components/create-new-directory-button';
import CreateNewNoteButton from './components/create-new-note-button';
import DirectoryAccordion from './components/directory-accodion';
import NoteButton from './components/note-button';
import SearchAndFilter from './components/search-and-filter';
import TrashBin from './components/trash-bin';
import { UserDropdownMenu } from './components/user-dropdown-menu';

export default function DirectoriesPanel() {
  const { data: userData, isLoading, isError } = useGetUserDataQuery();
  const { allDirectories, allNotes, inTrashNotes } = userData || {};
  const { searchText, isFilterOn, filterTagIds, isFilterFavoriteOn } = useSelector(
    (state: RootState) => state.searchAndFilter,
  );
  const filteredResults = useMemo(() => {
    if (!allNotes) return [];

    // filter by tags, favorite and not in trash
    const filteredNotes = allNotes.filter((note) => {
      if (isFilterFavoriteOn && !note.isFavorite) return false;
      if (
        filterTagIds.length &&
        filterTagIds.every((filterTagId) => !note._tags.map((tag) => tag._id).includes(filterTagId))
      )
        return false;
      if (note.isInTrash) return false;

      return true;
    });

    const fuse = new Fuse(filteredNotes, noteSearchFuseOptions);

    let fuseResults;

    fuseResults = fuse.search(searchText);

    if (!fuseResults.length) {
      fuseResults = filteredNotes.map((note) => ({
        item: note,
        matches: [
          {
            indices: [],
          },
        ],
      }));
    }

    return fuseResults;
  }, [allNotes, filterTagIds, isFilterFavoriteOn, searchText]);
  const isFiltering = searchText.length || (isFilterOn && (filterTagIds.length || isFilterFavoriteOn));

  return (
    <div className="h-screen overflow-auto flex flex-col w-full justify-between p-4 pt-2">
      <div className="flex justify-between items-center gap-1 mb-2">
        <UserDropdownMenu />
        <div className="flex">
          <CreateNewNoteButton />
          <CreateNewDirectoryButton />
        </div>
      </div>

      <SearchAndFilter />

      {isLoading ? (
        <div className="flex justify-center items-center grow">
          <Loader2 className="inline animate-spin mr-2" size={16} /> Loading notes...
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center grow">
          <Bug className="inline mr-2" size={16} /> Error while loading notes
        </div>
      ) : (
        allDirectories && (
          <Accordion type="multiple" className="grow flex flex-col justify-between">
            {!allNotes?.length ? (
              <div className="grow flex justify-center items-center italic text-secondary-foreground">
                <Ghost className="inline mr-2" size={16} /> It's empty here
              </div>
            ) : isFiltering ? (
              <div className="grid gap-1">
                {filteredResults.length ? (
                  filteredResults.map((fuseResult) => (
                    <div key={fuseResult.item._id}>
                      <NoteButton
                        note={fuseResult.item}
                        showMoreInfo
                        highlightIndices={fuseResult.matches![0].indices}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center pt-4 text-muted-foreground italic text-sm">
                    <Ghost className="inline mr-2" /> Can't find any note
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="space-y-1">
                  {allDirectories &&
                    allDirectories.map((directory) => (
                      <div key={directory._id}>
                        <DirectoryAccordion key={directory._id} directory={directory} />
                      </div>
                    ))}
                </div>
                <div className="space-y-1">
                  {allNotes &&
                    allNotes
                      .filter((note) => !note._directory)
                      .map((note) => (
                        <div key={note._id}>
                          <NoteButton note={note} />
                        </div>
                      ))}
                </div>
              </div>
            )}
            {inTrashNotes && <TrashBin inTrashNodes={inTrashNotes} />}
          </Accordion>
        )
      )}
    </div>
  );
}

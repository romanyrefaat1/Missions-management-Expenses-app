## Missiono — Final Finish Line

### 1. Fix mission editing

This is mandatory.

The **Edit Mission** action needs to successfully:

* Open the edit UI.
* Pre-fill the existing mission values.
* Allow changing mission name.
* Allow changing description.
* Allow changing state.
* Allow changing expected budget.
* Allow changing real budget.
* Allow changing completed status if your current design supports it.
* Save changes to Supabase.
* Immediately show the updated values in the mission page.
* Keep the changes after refreshing.
* Correctly handle loading while saving.
* Show an error if the update fails.
* Close the edit UI after a successful update.

**Done when:** you can edit a mission, refresh the browser, and everything is still correct.

---

### 2. Fix task editing

This should be part of the same final pass.

For a task, editing should allow whatever fields your current model supports, particularly:

* Name
* Description
* Expected price
* Paid price
* Quantity/count
* State/completion state
* Any other existing task fields already exposed by your UI

Then verify:

**Edit → Save → updated task appears → refresh → still correct.**

Don't add new task properties just for the sake of completeness.

---

### 3. Fix task search

Your search input currently exists, so it needs to actually work.

Test:

* Exact task name.
* Partial task name.
* Different capitalization.
* No results.
* Clearing the search.
* Multiple tasks with similar names.

Example:

`buy`

should find:

* Buy tomatoes
* Buy milk
* Buy food

Search should filter the currently displayed tasks without corrupting task state.

Also add a clean empty state such as:

> No tasks found.

---

### 4. Fix task filtering

Make the existing **Filter** control functional.

At minimum, your existing task states should be filterable:

* All
* In progress
* Completed
* Not completed

Whatever exact states your database uses, the UI and filtering logic need to agree.

Test combinations such as:

**Filter → Completed**

shows only completed tasks.

**Filter → In progress**

shows only in-progress tasks.

**Filter → All**

restores everything.

Also verify that filtering does not modify the actual database.

---

### 5. Fix task selection

Your **Select Tasks** functionality needs to work.

The expected behavior should be:

**Select Tasks → selection mode → tap tasks → selected tasks visually indicate selection.**

Then whatever actions you currently expose should work correctly.

At minimum verify:

* Selecting one task.
* Selecting multiple tasks.
* Deselecting a task.
* Selecting all, if your UI supports it.
* Cancelling selection.
* Selected state survives normal UI updates.
* Performing the available bulk action actually affects the selected tasks.

Don't invent complicated bulk operations. Just make the functionality you already designed work.

---

### 6. Fix task status/completion consistency

This is particularly important because you've already been working on keeping `state` and `is_completed` synchronized.

Verify the entire chain:

**Mark completed → state becomes COMPLETED**

and:

**state becomes COMPLETED → is_completed is true**

and:

**mark incomplete → state changes back correctly**

and:

**refresh → correct state remains**

Test this from both the Mission page and On the Go page.

This should be treated as a **data-integrity requirement**, not merely a UI feature.

---

### 7. Test On the Go completely

Don't redesign it. Test it.

Run through an actual mission from beginning to end:

**Mission with 4 tasks**

→ open On the Go
→ current task displayed
→ enter paid price
→ mark completed
→ next task becomes current
→ progress updates
→ completed task moves to Completed
→ next task appears under Up Next
→ finish final task
→ mission reaches correct completed state

Then refresh the page at different points.

Make sure realtime/state synchronization doesn't produce weird states.

This is probably the most important end-to-end test in the entire app.

---

### 8. Verify budget calculations

Use a real test mission and manually calculate the expected result.

For example:

Expected:

`20 + 30 + 50 = 100`

Paid:

`15 + 25 + 45 = 85`

Then verify Missiono displays the correct values.

Also test:

* No paid price yet.
* Zero paid price.
* Missing expected price.
* Multiple quantities.
* Completed vs incomplete tasks.
* Editing a task price.
* Editing a mission budget.

Make sure editing one value doesn't leave stale totals elsewhere.

---

### 9. Fix the warning/error UX

Your warnings work, but make sure they're not misleading.

Test cases such as:

* Mission has no real budget.
* Task has no expected price.
* Task has no paid price.
* Some tasks are configured and others aren't.

The warning should tell the user **what is wrong and what they can do about it**.

Also make sure it disappears automatically once the underlying problem is fixed.

---

### 10. Test empty states

You need these before calling the portfolio project complete.

Check:

**No missions**

The page shouldn't just look broken or empty.

**Mission with no tasks**

There should be a clear message/action to add the first task.

**Search returns nothing**

Show something like:

> No tasks found.

**No completed tasks**

The On the Go Completed section should still look intentional.

**No Up Next tasks**

Same idea.

These tiny states make a project feel finished.

---

### 11. Test authentication end-to-end

You've already built authentication, so now test the actual user experience.

Verify:

* Sign up.
* Login.
* Logout.
* Incorrect credentials.
* Protected routes.
* Refresh while authenticated.
* Refresh after logout.
* Cannot access another user's missions.
* Session survives navigation.

Especially verify the **Supabase RLS behavior**.

For a portfolio project, this is much more impressive than adding another visual feature.

---

### 12. Test realtime behavior

Because you're using Supabase Realtime, make sure the feature you're claiming actually works.

Open Missiono in two browser tabs using the same account.

Change a task in one tab.

Verify the second tab updates correctly.

Test:

* Task completion.
* Task editing.
* Mission editing.
* Budget changes if applicable.
* Task creation.

If something isn't realtime, that's okay—just don't pretend it is.

---

### 13. Clean all test/demo data

This is mandatory before the portfolio version.

Remove things like:

> A test mission
> Task 2
> Jjj
> Task with image
> Description
> 255 paid
> 0.8 paid

Your screenshots currently expose test data, which makes the project feel unfinished even though the architecture is good.

Create **2–3 realistic missions** instead.

For example:

> Buy groceries
> Prepare school presentation
> Pick up package

And use believable tasks/prices.

---

### 14. Fix obvious visual inconsistencies

Don't redesign the app.

Just polish:

* inconsistent text sizes
* weird spacing
* buttons with placeholder names like `Button`
* unnecessary `#` displays
* awkward labels
* elements overflowing on mobile
* inconsistent capitalization
* buttons that don't visually communicate their state
* strange empty areas
* clipped text
* dialogs/sheets that don't behave correctly

Your goal is:

> **Nothing makes a portfolio reviewer stop and think "this looks unfinished."**

---

### 15. Test mobile at several widths

Since Missiono is clearly designed around mobile usage, check at least:

* ~375px
* ~390px
* ~430px
* desktop

Pay particular attention to:

* Mission cards
* Task cards
* Add Task sheet
* Edit Mission UI
* Edit Task UI
* Navigation sheet
* On the Go
* Long mission/task names
* Long descriptions
* Buttons

Don't optimize for one screenshot size.

---

### 16. Test the entire application like a stranger

This is the **final test**.

Pretend you've never seen the code.

Start with:

**Sign up**

Then:

**Create Mission**

Then:

**Add Tasks**

Then:

**Edit Mission**

Then:

**Edit Task**

Then:

**Search**

Then:

**Filter**

Then:

**Select**

Then:

**Open Mission**

Then:

**On the Go**

Then:

**Complete everything**

Then:

**Refresh**

Then:

**Log out**

Then log back in.

If that entire journey works without you needing to touch the database manually, **you're done.**

---

# Your actual "DONE" criteria

I would literally use these as your final gate:

* [ ] Edit Mission works
* [ ] Edit Task works
* [ ] Search works
* [ ] Filter works
* [ ] Select Tasks works
* [ ] Task completion/state synchronization works
* [ ] On the Go full workflow works
* [ ] Budget calculations are correct
* [ ] Warnings update correctly
* [ ] Empty states exist
* [ ] Authentication works correctly
* [ ] RLS prevents cross-user data access
* [ ] Realtime updates work where intended
* [ ] Test data is removed
* [ ] No placeholder UI remains
* [ ] Mobile layout works at several widths
* [ ] Full stranger-style user journey works
* [ ] Production deployment works without console/runtime errors

### And then: **STOP.**

Don't add chat.

Don't add AI.

Don't add notifications.

Don't add gamification.

Don't add analytics dashboards.

Don't add teams.

Don't add another 15 settings.

Don't redesign the navigation.

Once the checklist above passes, **Missiono is finished as a portfolio project.**

At that point your next task isn't "make Missiono better."

It's **document Missiono well and put it in your portfolio.**

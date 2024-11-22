import React, { Fragment, useEffect, useState } from "react";

import Backdrop from "../../Backdrop/Backdrop";
import Modal from "../../Modal/Modal";
import Input from "../../Form/Input/Input";
import FilePicker from "../../Form/Input/FilePicker";
import Image from "../../Image/Image";
import { required, length } from "../../../util/validators";
import { generateBase64FromImage } from "../../../util/image";

interface FeedEditProps {
  editing: boolean;
  selectedPost?: {
    title: string;
    imagePath: string;
    content: string;
  } | null;
  loading: boolean;
  onCancelEdit: () => void;
  onFinishEdit: (post: {
    title: string;
    image: string;
    content: string;
  }) => Promise<void>;
}

const POST_FORM = {
  title: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
  image: {
    value: "",
    valid: false,
    touched: false,
    validators: [required],
  },
  content: {
    value: "",
    valid: false,
    touched: false,
    validators: [required, length({ min: 5 })],
  },
};

const FeedEdit: React.FC<FeedEditProps> = ({
  editing,
  selectedPost,
  loading,
  onCancelEdit,
  onFinishEdit,
}) => {
  const [postForm, setPostForm] = useState(POST_FORM);
  const [formIsValid, setFormIsValid] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editing && selectedPost) {
      setPostForm({
        title: {
          value: selectedPost.title,
          valid: true,
          touched: true,
          validators: [required, length({ min: 5 })],
        },
        image: {
          value: selectedPost.imagePath,
          valid: true,
          touched: true,
          validators: [required],
        },
        content: {
          value: selectedPost.content,
          valid: true,
          touched: true,
          validators: [required, length({ min: 5 })],
        },
      });
      setFormIsValid(true);
    }
  }, [editing, selectedPost]);

  const postInputChangeHandler = (
    input: keyof typeof POST_FORM,
    value: string,
    files?: FileList
  ) => {
    if (files && files[0]) {
      generateBase64FromImage(files[0])
        .then((b64: string) => setImagePreview(b64))
        .catch(() => setImagePreview(null));
    }

    setPostForm((prevForm) => {
      let isValid = true;
      for (const validator of prevForm[input].validators) {
        isValid = isValid && validator(value);
      }

      const updatedForm = {
        ...prevForm,
        [input]: {
          ...prevForm[input],
          valid: isValid,
          value: files ? files[0] : value,
        },
      };

      let formValid = true;
      for (const inputName in updatedForm) {
        const key = inputName as keyof typeof POST_FORM;
        formValid = formValid && updatedForm[key].valid;
      }
      setFormIsValid(formValid);
      return updatedForm;
    });
  };

  const inputBlurHandler = (input: keyof typeof POST_FORM) => {
    setPostForm((prevForm) => ({
      ...prevForm,
      [input]: {
        ...prevForm[input],
        touched: true,
      },
    }));
  };

  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview(null);
    onCancelEdit();
  };

  const acceptPostChangeHandler = () => {
    const post = {
      title: postForm.title.value,
      image: postForm.image.value,
      content: postForm.content.value,
    };
    onFinishEdit(post);
    cancelPostChangeHandler();
  };

  return editing ? (
    <Fragment>
      <Backdrop onClick={cancelPostChangeHandler} />
      <Modal
        title="New Post"
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={loading}
      >
        <form>
          <Input
            id="title"
            label="Title"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("title")}
            valid={postForm["title"].valid}
            touched={postForm["title"].touched}
            value={postForm["title"].value}
          />
          <FilePicker
            id="image"
            label="Image"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("image")}
            valid={postForm["image"].valid}
            touched={postForm["image"].touched}
          />
          <div className="new-post__preview-image">
            {!imagePreview && <p>Please choose an image.</p>}
            {imagePreview && <Image imageUrl={imagePreview} contain left />}
          </div>
          <Input
            id="content"
            label="Content"
            control="textarea"
            rows="5"
            onChange={postInputChangeHandler}
            onBlur={() => inputBlurHandler("content")}
            valid={postForm["content"].valid}
            touched={postForm["content"].touched}
            value={postForm["content"].value}
          />
        </form>
      </Modal>
    </Fragment>
  ) : null;
};

export default FeedEdit;
